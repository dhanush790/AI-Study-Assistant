from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile

class DocumentSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        
    def test_unauthorized_upload(self):
        """Test that unauthenticated users cannot upload files"""
        file = SimpleUploadedFile("test.txt", b"file_content", content_type="text/plain")
        response = self.client.post('/api/documents/', {'file': file, 'title': 'Test'})
        self.assertEqual(response.status_code, 401)
        
    def test_invalid_extension(self):
        """Test that uploading a file with an invalid extension is rejected"""
        self.client.force_authenticate(user=self.user)
        file = SimpleUploadedFile("malicious.exe", b"MZ...", content_type="application/x-msdownload")
        response = self.client.post('/api/documents/', {'file': file, 'title': 'Virus'})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Only PDF, DOCX and TXT files are supported.", str(response.data))
