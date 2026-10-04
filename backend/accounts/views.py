from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

from rest_framework.views import APIView
from rest_framework.response import Response
from documents.models import Document
from chat.models import Conversation, Message

class DashboardStatsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        total_materials = Document.objects.filter(uploaded_by=user).count()
        total_conversations = Conversation.objects.filter(user=user).count()
        questions_asked = Message.objects.filter(conversation__user=user, role='user').count()

        return Response({
            'total_materials': total_materials,
            'total_conversations': total_conversations,
            'questions_asked': questions_asked
        })
