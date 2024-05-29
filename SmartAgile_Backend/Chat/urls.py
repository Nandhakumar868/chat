from django.urls import path
from .views import CreateChatRoomView, UserChatRoomView, MessageListView, GetChatRoomView

urlpatterns = [
    path('chatroom/projects/<int:proj_id>/', CreateChatRoomView.as_view(), name='create-chat-room'),
    path('chatroom/users/<int:user_id>/', UserChatRoomView.as_view(), name='user-chat-room'),
    path('chatroom/get/<int:proj_id>/',GetChatRoomView.as_view(), name='get-chat-room'),
    path('chatroom/<int:chatroom_id>/messages/', MessageListView.as_view(), name='messages')
]
