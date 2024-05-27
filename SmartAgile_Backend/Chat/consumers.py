import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, Message
from Projects.models import ProjectMembers
from .serializers import MessageSerializer
import logging
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)

class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chatroom_id = self.scope['url_route']['kwargs']['chatroom_id']
        self.chatroom_group_name = f'chat_{self.chatroom_id}'

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
    
    async def receive(self, text_data):
        logger.info(f"Received WebSocket message: {text_data}")
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError as e:
            logger.error(f"Error decoding JSON: {e}")
            return 
        
        message = data.get('message')
        sender = data.get('sender')

        if message is None or sender is None:
            logger.error("Message or sender is missing from the received data")
            return
        
        try:
            sender = await sync_to_async(ProjectMembers.objects.get)(pk=sender)
            chatroom = await sync_to_async(ChatRoom.objects.get)(pk=self.chatroom_id)

            if sender.project != chatroom.project:
                logger.warning(f"Sender project mismatch: {sender.project} vs {chatroom.project}")
                return
        
            message_instance = sync_to_async(await Message.objects.create)(
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
        except ProjectMembers.DoesNotExist:
            logger.error(f"Sender with ID {sender} does not exist")
        except ChatRoom.DoesNotExist:
            logger.error(f"ChatRoom with ID {self.chatroom_id} does not exist")
        except Exception as e:
            logger.error(f"Error processing WebSocket message: {e}")
            

    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps(message))
        logger.info(f"Sent WebSocket message: {message}")