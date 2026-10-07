import os
from django.conf import settings
from django.utils import timezone
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from documents.models import Document
import threading

from .engine import get_embeddings

def process_document(document_id):
    try:
        # 1. Fetch document and update status
        document = Document.objects.get(id=document_id)
        document.processing_status = 'processing'
        document.save(update_fields=['processing_status'])

        file_path = document.file.path
        ext = document.file_type.lower()

        # 2. Extract Text
        if ext == 'pdf':
            loader = PyPDFLoader(file_path)
        elif ext == 'docx':
            loader = Docx2txtLoader(file_path)
        elif ext == 'txt':
            loader = TextLoader(file_path, encoding='utf-8')
        else:
            raise ValueError(f"Unsupported file type: {ext}")
            
        docs = loader.load()

        # Add document metadata to each chunk
        for doc in docs:
            doc.metadata['document_id'] = document_id
            doc.metadata['user_id'] = document.uploaded_by.id

        # 3. Chunking
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_documents(docs)

        if not chunks:
            raise ValueError("No text could be extracted from the document.")

        # 4. Generate Embeddings & Store in ChromaDB
        chroma_dir = os.path.join(settings.BASE_DIR, 'chroma_db')
        
        # We use from_documents which will automatically generate embeddings and insert
        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=get_embeddings(),
            persist_directory=chroma_dir
        )

        # 5. Update Status
        document.processing_status = 'completed'
        document.number_of_chunks = len(chunks)
        document.processed_at = timezone.now()
        document.save(update_fields=['processing_status', 'number_of_chunks', 'processed_at'])
        
        print(f"Successfully processed document {document_id}: {len(chunks)} chunks.")

    except Exception as e:
        print(f"Error processing document {document_id}: {e}")
        try:
            document = Document.objects.get(id=document_id)
            document.processing_status = 'failed'
            document.save(update_fields=['processing_status'])
        except Exception:
            pass

def start_document_processing(document_id):
    """Starts the document processing pipeline in a background thread."""
    thread = threading.Thread(target=process_document, args=(document_id,))
    thread.daemon = True
    thread.start()
