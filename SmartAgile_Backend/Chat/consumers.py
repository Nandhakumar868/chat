import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, Message
from Projects.models import ProjectMembers
from .serializers import MessageViewSerializer
from channels.db import database_sync_to_async
import logging
from asgiref.sync import sync_to_async

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

    
    # async def receive(self, text_data):
    #     data = json.loads(text_data)

    #     event = {
    #         'type' : 'send_message',
    #         'message' : data
    #     }

    #     await self.channel_layer.group_send(self.chatroom_group_name, event)

    # async def send_message(self, event):
    #     data = event['message']
    #     await self.create_message(data = data)

    #     response = {
    #         'sender' : data['sender'],
    #         'message' : data['message']
    #     }

    #     await self.send(text_data=json.dumps({'message' : response}))

    # @database_sync_to_async
    # def create_message(self, data):
    #     chatroom = ChatRoom.objects.get(pk = data['chatroom'])

    #     if not Message.objects.filter(message=data['message'], sender=data['sender']).exists():
    #         new_message = Message.objects.create(chatroom=chatroom, message=data['message'], sender=[data['sender']])
    
    # async def receive(self, text_data):
    #     logger.info(f"Received WebSocket message: {text_data}")
    #     try:
    #         data = json.loads(text_data)
    #         message = data.get('message')
    #         sender = data.get('sender')
    #     except json.JSONDecodeError as e:
    #         logger.error(f"Error decoding JSON: {e}")
    #         return 
        
    #     if message:
    #         event = {
    #             'type' : 'chat_message',
    #             'message' : message,
    #             'sender' : sender
    #         }
    #         await self.channel_layer.group_send(self.chatroom_group_name, event)

    # async def send_message(self, event):
    #     message = event['message']
    #     sender = event['sender']

    #     await self.create_message(sender, message)

    #     response = {
    #         'sender' : sender,
    #         'message' : message
    #     }

    #     await self.send(text_data=json.dumps(response))

    
    # @database_sync_to_async
    # def create_message(self, sender, message):
    #     try:
    #         chatroom = ChatRoom.objects.get(pk=self.chatroom_id)
    #         Message.objects.create(chatroom=chatroom, sender=sender, message=message)
    #     except(ChatRoom.DoesNotExist, ValueError):
    #         print('Error creating messages')
        
    @database_sync_to_async
    def receive(self, text_data):
        logger.info(f"Received WebSocket message: {text_data}")
        try:
            data = json.loads(text_data)
            print(data)
        except json.JSONDecodeError as e:
            logger.error(f"Error decoding JSON: {e}")
            return 
        
        message = data.get('message')
        print(message)
        sender = data.get('sender')
        print(sender)

        if message is None or sender is None:
            logger.error("Message or sender is missing from the received data")
            return
        
        try:
            sender = ProjectMembers.objects.get(pk=sender)
            chatroom = ChatRoom.objects.get(pk=self.chatroom_id)


            # if sender.project != chatroom.project:
            #     logger.warning(f"Sender project mismatch: {sender.project} vs {chatroom.project}")
            #     return
        
            message_instance = Message.objects.create(
                chatroom = chatroom,
                sender = sender,
                message = message
            ) 

            serializer = MessageViewSerializer(message_instance)
            message_data = serializer.data

            self.channel_layer.group_send(
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