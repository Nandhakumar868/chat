from django.contrib import admin
from .models import ChatRoom, Message

# Register your models here.
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ['project', 'created_at']

class MessageAdmin(admin.ModelAdmin):
    list_display = ['chatroom', 'sender', 'message', 'file']

admin.site.register(ChatRoom, ChatRoomAdmin)
admin.site.register(Message, MessageAdmin)
