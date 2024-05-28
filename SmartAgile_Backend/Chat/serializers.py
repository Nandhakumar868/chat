from rest_framework import serializers
from .models import ChatRoom, Message
from Projects.models import ProjectMembers
from Projects.serializers import ProjectMemberSerializer

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ChatRoom
        fields = ['id', 'project', 'created_at']
        read_only_fields = ['created_at']

class MessageSerializer(serializers.ModelSerializer):
    # sender_details = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    user_image = serializers.SerializerMethodField()

    def get_sender_details(self, obj):
        sender_id = obj.sender.id
        if sender_id is not None:
            try:
                project_member = ProjectMembers.objects.get(pk=sender_id)
                serialized_data = ProjectMemberSerializer(project_member).data
                return {
                    'user': serialized_data.get('user'),
                    'username': serialized_data.get('username'),
                    'image': serialized_data.get('image')
                }
            except ProjectMembers.DoesNotExist:
                return None
        return None
    
    def get_user_id(self, obj):
        sender_details = self.get_sender_details(obj)
        return sender_details.get('user') if sender_details else None
    
    def get_username(self, obj):
        sender_details = self.get_sender_details(obj)
        return sender_details.get('username') if sender_details else None
    
    def get_user_image(self, obj):
        sender_details = self.get_sender_details(obj)
        return sender_details.get('image') if sender_details else None
    
    class Meta:
        model = Message
        fields = ['id', 'chatroom', 'sender', 'message', 'sent_at',  'user_id', 'username', 'user_image']
        read_only_fields = ['sent_at', 'user_id', 'username', 'user_image']

class MessageViewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ['id', 'chatroom', 'sender', 'message', 'sent_at']
        read_only_fields = ['sent_at']