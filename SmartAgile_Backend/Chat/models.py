from django.db import models
from Projects.models import Project, ProjectMembers

# Create your models here.
class ChatRoom(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='chat_room')
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(ProjectMembers, on_delete=models.CASCADE, related_name='sender_messages')
    message = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='message-attachments/', blank=True, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)