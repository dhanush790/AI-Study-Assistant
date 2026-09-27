import os
from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file', 'file_type', 'file_size', 
            'processing_status', 'number_of_chunks', 
            'uploaded_at', 'processed_at'
        ]
        read_only_fields = [
            'id', 'file_type', 'file_size', 'processing_status', 
            'number_of_chunks', 'uploaded_at', 'processed_at'
        ]

    def validate_file(self, value):
        MAX_FILE_SIZE = int(os.environ.get('MAX_FILE_SIZE_MB', 20)) * 1024 * 1024
        
        if value.size > MAX_FILE_SIZE:
            raise serializers.ValidationError(f"Maximum file size is {os.environ.get('MAX_FILE_SIZE_MB', 20)} MB.")
            
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ['.pdf', '.docx', '.txt']:
            raise serializers.ValidationError("Only PDF, DOCX and TXT files are supported.")
            
        return value
