from django.urls import path
from .views import chat_view, summary_view, mcq_view

urlpatterns = [
    path('chat/', chat_view, name='rag-chat'),
    path('summarize/', summary_view, name='rag-summarize'),
    path('mcq/', mcq_view, name='rag-mcq'),
]
