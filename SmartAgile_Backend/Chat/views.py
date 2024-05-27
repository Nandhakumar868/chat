from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ChatRoom, Message
from Projects.models import Project, ProjectMembers
from Users.models import User
from .serializers import ChatRoomSerializer, MessageSerializer
from django.shortcuts import get_object_or_404
from Projects.serializers import ProjectSerializer, ProjectMemberSerializer
import logging

# Create your views here.

logger = logging.getLogger(__name__)

class CreateChatRoomView(APIView):
    def post(self, request, proj_id):
        try:
            project = get_object_or_404(Project, pk=proj_id)

            if hasattr(project, 'chat_room'):
                return Response({'message' : 'Chat room for the project already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            chat_room = ChatRoom.objects.create(project=project)
            serializer = ChatRoomSerializer(chat_room)

            if not serializer.data:
                raise ValueError('Serializer data is invalid')
            
            return Response({'message' : 'Chatroom created successfully', 'chatroom' : serializer.data}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'message' : 'An error occurred', 'error' : str(e)}, status=status.HTTP_404_NOT_FOUND)
        

class UserChatRoomView(APIView):

    def get(self, request, user_id):
        try:
            user = get_object_or_404(User, pk=user_id)

            project = Project.objects.filter(proj_members__profile__user=user).select_related('organization')

            chat_rooms = ChatRoom.objects.filter(project__in=project).select_related('project')

            chat_room_serializer = ChatRoomSerializer(chat_rooms, many = True)
            chat_room_data = chat_room_serializer.data

            project_details = []
            chat_room_id = []
            for chat_room in chat_room_data:
                proj_id = chat_room['project']
                project_detail = Project.objects.get(pk=proj_id)
                proj_serializer = ProjectSerializer(project_detail)
                project_details.append(proj_serializer.data)

                chatroom_data = chat_room['id']
                chat_room_id.append(chatroom_data)
        
            return Response({'chatroom_data' : chat_room_id,'project_details' : project_details}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'message' : 'An error occurred', 'error' : str(e)}, status=status.HTTP_404_NOT_FOUND)
        

class MessageListView(APIView):
    def get(self, request, chatroom_id):
        chatroom = get_object_or_404(ChatRoom, pk=chatroom_id)
        messages = chatroom.messages.all()
        serializer = MessageSerializer(messages, many = True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, chatroom_id):
        chatroom = get_object_or_404(ChatRoom, pk=chatroom_id)
        sender = get_object_or_404(ProjectMembers, pk = request.data['sender'])
        
        if sender.project != chatroom.project:
            return Response({'error' : 'Sender is not a member of this project'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(chatroom=chatroom, sender=sender)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
