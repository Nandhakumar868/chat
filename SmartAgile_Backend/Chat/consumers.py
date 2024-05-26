import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, Message
from Projects.models import ProjectMembers
from channels.db import database_sync_to_async
from .serializers import MessageSerializer

class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chatroom_id = self.scope['url_route']['kwargs']['chatroom_id']
        self.chatroom_group_name = f'chat_{self.chatroom_id}'

        await self.channel_layer.group_add(
            self.chatroom_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.chatroom_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender']

        sender = await database_sync_to_async(ProjectMembers.objects.get)(pk=sender_id)
        chatroom = await database_sync_to_async(ChatRoom.objects.get)(pk=self.chatroom_id)

        if sender.project != chatroom.project:
            return
        
        message_instance = await database_sync_to_async(Message.objects.create)(
            chatroom = chatroom,
            sender = sender,
            message = message
        )

        serializer = MessageSerializer(message_instance)
        message_data = serializer.data

        await self.channel_layer.group_send(
            self.chatroom_group_name,
            {
                'type' : 'chat_message',
                'message' : message_data
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'message' : message,
            'sender' : sender
        }))