import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, Message
from Projects.models import ProjectMembers
from .serializers import MessageSerializer
from channels.db import database_sync_to_async
import logging
from asgiref.sync import sync_to_async
from Projects.serializers import ProjectMemberSerializer

logger = logging.getLogger(__name__)

class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chatroom_id = self.scope['url_route']['kwargs']['chatroom_id']
        self.chatroom_group_name = f'{self.chatroom_id}'

        await self.channel_layer.group_add(
            self.chatroom_group_name,
            self.channel_name
        )
        

        await self.accept()
        logger.info(f"WebSocket connection established for chatroom: {self.chatroom_id}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.chatroom_group_name,
            self.channel_name
        )
        logger.info(f"WebSocket connection closed for chatroom: {self.chatroom_id}, close_code: {close_code}")

    async def receive(self,text_data):
        logger.info(f"Received Websocket message : {text_data}")
        try:
            data = json.loads(text_data)
            message = data.get('message')
            sender = data.get('sender')
            if message and sender:
                message_instance = await self.create_message(sender, message)
                if message_instance:
                    sender_details = await self.get_sender_details(message_instance.sender.id)
                    if sender_details:
                        message_data = self.serialize_message(message_instance, sender_details)
                        print(message_data)
                        await self.channel_layer.group_send(
                            self.chatroom_group_name,
                            {
                                'type' : 'chat_message',
                                'message' : message_data
                            }
                        )
        except json.JSONDecodeError as e:
            logger.error(f'Error decoding JSON : {e}')
        
    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))
        logger.info(f'Sent websocket message: {message}')

    @database_sync_to_async
    def create_message(self, sender, message):
        try:
            sender = ProjectMembers.objects.get(pk=sender)
            chatroom = ChatRoom.objects.get(pk=self.chatroom_id)
            return Message.objects.create(chatroom=chatroom, sender=sender, message=message)
        except ProjectMembers.DoesNotExist:
            logger.error(f"Sender does not exist")
        except ChatRoom.DoesNotExist:
            logger.error(f"ChatRoom with ID {self.chatroom_id} does not exist")
        except Exception as e:
            logger.error(f"Error creating message: {e}")
            return None
    
    @database_sync_to_async
    def get_sender_details(self,sender_id):
        try:
            project_member = ProjectMembers.objects.get(pk=sender_id)
            serialized_data = ProjectMemberSerializer(project_member).data
            return {
                'user' : serialized_data.get('user'),
                'username' : serialized_data.get('username'),
                'image' : serialized_data.get('image')
            }
        except ProjectMembers.DoesNotExist:
            return None
    
    def serialize_message(self, message_instance, sender_details):
        serializer = MessageSerializer(message_instance, context={'sender_details': sender_details})
        return serializer.data
