import os
from rest_framework import viewsets, permissions
from .models import Document
from .serializers import DocumentSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(uploaded_by=self.request.user).order_by('-uploaded_at')

    def perform_create(self, serializer):
        file = self.request.data.get('file')
        file_size = file.size
        ext = os.path.splitext(file.name)[1].lower().replace('.', '')
        
        serializer.save(
            uploaded_by=self.request.user,
            file_size=file_size,
            file_type=ext
        )
