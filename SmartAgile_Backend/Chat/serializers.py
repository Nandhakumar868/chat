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
    sender_details_user = serializers.SerializerMethodField()
    sender_details_username = serializers.SerializerMethodField()

    def get_sender_details(self, obj):
        sender_id = obj.sender.id
        if sender_id is not None:
            try:
                project_member = ProjectMembers.objects.get(pk=sender_id)
                return ProjectMemberSerializer(project_member).data
            except ProjectMembers.DoesNotExist:
                return None
        else:
            return None
        
    def get_sender_details_user(self, obj):
        sender_details = self.get_sender_details(obj)
        print(sender_details)
        if sender_details:
            return sender_details.get('user')
        return None
    
    def get_sender_details_username(self, obj):
        sender_details = self.get_sender_details(obj)
        print(sender_details)
        if sender_details:
            return sender_details.get('username')
        return None
    
    class Meta:
        model = Message
        fields = ['id', 'chatroom', 'sender', 'message', 'sent_at',  'sender_details_user', 'sender_details_username']
        read_only_fields = ['sent_at',  'sender_details_user', 'sender_details_username']