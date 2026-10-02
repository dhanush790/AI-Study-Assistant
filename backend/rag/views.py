from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .engine import answer_question, generate_summary, generate_mcq

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_view(request):
    document_id = request.data.get('document_id') # Optional: filter by doc
    query = request.data.get('message')
    
    if not query:
        return Response({"error": "Message is required"}, status=400)
        
    try:
        result = answer_question(request.user.id, document_id, query)
        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def summary_view(request):
    document_id = request.data.get('document_id')
    if not document_id:
        return Response({"error": "Document ID is required"}, status=400)
        
    try:
        summary = generate_summary(request.user.id, document_id)
        return Response({"summary": summary})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mcq_view(request):
    document_id = request.data.get('document_id')
    count = request.data.get('count', 5)
    
    if not document_id:
        return Response({"error": "Document ID is required"}, status=400)
        
    try:
        mcqs = generate_mcq(request.user.id, document_id, int(count))
        return Response({"mcqs": mcqs})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
