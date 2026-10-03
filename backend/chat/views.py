from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from rag.engine import answer_question

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Allow filtering by document
        document_id = self.request.query_params.get('document')
        qs = Conversation.objects.filter(user=self.request.user).order_by('-updated_at')
        if document_id:
            qs = qs.filter(document_id=document_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        user_message_content = request.data.get('content')
        
        if not user_message_content:
            return Response({"error": "Message content is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # 1. Save user message
        Message.objects.create(
            conversation=conversation,
            role='user',
            content=user_message_content
        )
        
        # 2. Call RAG engine
        try:
            document_id = conversation.document_id if conversation.document else None
            ai_response = answer_question(request.user.id, document_id, user_message_content)
            
            # Update title if it's the first message
            if conversation.messages.count() == 1 and conversation.title == "New Conversation":
                conversation.title = user_message_content[:50] + "..."
                conversation.save(update_fields=['title'])
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # 3. Save AI message
        ai_message = Message.objects.create(
            conversation=conversation,
            role='assistant',
            content=ai_response.get("answer", ""),
            sources=ai_response.get("sources", [])
        )
        
        return Response(MessageSerializer(ai_message).data, status=status.HTTP_201_CREATED)
