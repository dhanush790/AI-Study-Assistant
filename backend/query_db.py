import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from documents.models import Document
from chat.models import Conversation, Message
from django.contrib.auth.models import User

user = User.objects.first()
print(f'User: {user.username}')
print(f'Documents: {Document.objects.filter(user=user).count()}')
print(f'Conversations: {Conversation.objects.filter(user=user).count()}')
print(f'Messages: {Message.objects.filter(conversation__user=user, role="user").count()}')
