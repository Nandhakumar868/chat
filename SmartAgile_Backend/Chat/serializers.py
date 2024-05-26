from rest_framework import serializers
from .models import ChatRoom, Message

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ChatRoom
        fields = ['id', 'project', 'created_at']
        read_only_fields = ['created_at']

class MessageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Message
        fields = ['id', 'chatroom', 'sender', 'message', 'sent_at']
        read_only_fields = ['sent_at']