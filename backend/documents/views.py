import os
from rest_framework import viewsets, permissions
from .models import Document
from .serializers import DocumentSerializer
from rag.document_processor import start_document_processing

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(uploaded_by=self.request.user).order_by('-uploaded_at')

    def perform_create(self, serializer):
        file = serializer.validated_data.get('file')
        file_size = file.size
        ext = os.path.splitext(file.name)[1].lower().replace('.', '')
        
        document = serializer.save(
            uploaded_by=self.request.user,
            file_size=file_size,
            file_type=ext
        )
        
        # Trigger background processing
        start_document_processing(document.id)
