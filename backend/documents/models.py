import os
from django.db import models
from django.contrib.auth.models import User

class Document(models.Model):
    STATUS_CHOICES = (
        ('uploaded', 'Uploaded'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )

    def user_directory_path(instance, filename):
        # file will be uploaded to media/user_<id>/<filename>
        return 'user_{0}/{1}'.format(instance.uploaded_by.id, filename)

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to=user_directory_path)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    file_type = models.CharField(max_length=10)
    file_size = models.IntegerField(help_text="File size in bytes")
    processing_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='uploaded')
    number_of_chunks = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title
