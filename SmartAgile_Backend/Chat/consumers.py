import base64
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, Message
from Projects.models import ProjectMembers
from .serializers import MessageSerializer
from channels.db import database_sync_to_async
import logging
from Projects.serializers import ProjectMemberSerializer
from django.core.files.base import ContentFile

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
            file_data = data.get('file')
            file_name = data.get('file_name')

            if sender:
                message_instance = await self.create_message(sender, message, file_data, file_name)
                if message_instance:
                    sender_details = await self.get_sender_details(message_instance.sender.id)
                    if sender_details:
                        message_data = self.serialize_message(message_instance, sender_details)
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
    def create_message(self, sender, message, file_data, file_name):
        try:
            sender = ProjectMembers.objects.get(pk=sender)
            chatroom = ChatRoom.objects.get(pk=self.chatroom_id)
            message_instance = Message.objects.create(chatroom=chatroom, sender=sender, message=message)

            if file_data and file_name:
                try:
                    decoded_file_data = base64.b64decode(file_data)
                    content_file = ContentFile(decoded_file_data, name=file_name)
                    message_instance.file = content_file
                except (base64.binascii.Error, ValueError) as e:
                    logger.error(f'Error decoding file data: {e}')
                    print('Error decoding base64 file data')
                    return None

            message_instance.save()
            return message_instance
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
    

# async def receive(self,text_data):
#         logger.info(f"Received Websocket message : {text_data}")
#         try:
#             data = json.loads(text_data)
#             message = data.get('message')
#             sender = data.get('sender')
#             file_data = data.get('file')

#             if message and sender:
#                 message_instance = await self.create_message(sender, message)
#                 if message_instance:
#                     sender_details = await self.get_sender_details(message_instance.sender.id)
#                     if sender_details:
#                         message_data = self.serialize_message(message_instance, sender_details)
#                         await self.channel_layer.group_send(
#                             self.chatroom_group_name,
#                             {
#                                 'type' : 'chat_message',
#                                 'message' : message_data
#                             }
#                         )
#             elif file_data and sender:
#                     message_instance = await self.create_file_message(sender, file_data)
#                     if message_instance:
#                         sender_details = await self.get_sender_details(message_instance.sender.id)
#                         if sender_details:
#                             attachment_data = self.serializer_attachment(message_instance, sender_details)
#                             await self.channel_layer.group_send(
#                                 self.chatroom_group_name,
#                                 {
#                                     'type' : 'chat_message',
#                                     'message' : attachment_data
#                                 }
#                             )
#         except json.JSONDecodeError as e:
#             logger.error(f'Error decoding JSON : {e}')
        
#     async def chat_message(self, event):
#         message = event['message']
#         await self.send(text_data=json.dumps(message))
#         logger.info(f'Sent websocket message: {message}')

#     @database_sync_to_async
#     def create_message(self, sender, message):
#         try:
#             sender = ProjectMembers.objects.get(pk=sender)
#             chatroom = ChatRoom.objects.get(pk=self.chatroom_id)
#             return Message.objects.create(chatroom=chatroom, sender=sender, message=message)
#         except ProjectMembers.DoesNotExist:
#             logger.error(f"Sender does not exist")
#         except ChatRoom.DoesNotExist:
#             logger.error(f"ChatRoom with ID {self.chatroom_id} does not exist")
#         except Exception as e:
#             logger.error(f"Error creating message: {e}")
#             return None
        
#     @database_sync_to_async
#     def create_file_message(self, sender, file_data):
#         try:
#             sender = ProjectMembers.objects.get(pk=sender)
#             chatroom = ChatRoom.objects.get(pk=self.chatroom_id)
#             return Message.objects.create(chatroom=chatroom, sender=sender, file=file_data)
#         except ProjectMembers.DoesNotExist:
#             logger.error(f"Sender does not exist")
#         except ChatRoom.DoesNotExist:
#             logger.error(f"ChatRoom with ID {self.chatroom_id} does not exist")
#         except Exception as e:
#             logger.error(f"Error creating File message: {e}")
#             return None
    
#     @database_sync_to_async
#     def get_sender_details(self,sender_id):
#         try:
#             project_member = ProjectMembers.objects.get(pk=sender_id)
#             serialized_data = ProjectMemberSerializer(project_member).data
#             return {
#                 'user' : serialized_data.get('user'),
#                 'username' : serialized_data.get('username'),
#                 'image' : serialized_data.get('image')
#             }
#         except ProjectMembers.DoesNotExist:
#             return None
    
#     def serialize_message(self, message_instance, sender_details):
#         serializer = MessageSerializer(message_instance, context={'sender_details': sender_details})
#         return serializer.data
    
#     def serializer_attachment(self, attachment_instance, sender_details):
#         serializer = MessageSerializer(attachment_instance, context={'sender_details': sender_details})
#         return serializer.data
