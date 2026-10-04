import os
import json
from django.conf import settings
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from documents.models import Document

# Use the same embeddings model
embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def get_llm():
    api_key = os.environ.get("LLM_API_KEY") or os.environ.get("GROQ_API_KEY", "")
    # Use the specific user-requested OpenAI open source model that Groq now hosts
    model_name = "openai/gpt-oss-20b"
    return ChatGroq(temperature=0, groq_api_key=api_key, model_name=model_name)

def get_retriever(user_id, document_id=None, k=4):
    chroma_dir = os.path.join(settings.BASE_DIR, 'chroma_db')
    vectorstore = Chroma(persist_directory=chroma_dir, embedding_function=embeddings_model)
    
    # Create filter based on user and optionally specific document
    if document_id:
        search_filter = {
            "$and": [
                {"user_id": user_id},
                {"document_id": document_id}
            ]
        }
    else:
        search_filter = {"user_id": user_id}
        
    return vectorstore.as_retriever(search_kwargs={"k": k, "filter": search_filter})

def answer_question(user_id, document_id, query):
    retriever = get_retriever(user_id, document_id)
    docs = retriever.invoke(query)
    
    context = "\n\n".join([f"Content: {d.page_content}\nSource Page: {d.metadata.get('page', 'N/A')}" for d in docs])
    
    prompt = PromptTemplate.from_template(
        "You are an intelligent study assistant. Use the following context extracted from the user's study materials to answer the question.\n"
        "If the context does not contain the answer, say 'I don't have enough information from the uploaded documents to answer this.'\n"
        "Be concise and clear.\n\n"
        "Context:\n{context}\n\n"
        "Question: {question}\n\n"
        "Answer:"
    )
    
    llm = get_llm()
    chain = prompt | llm
    
    response = chain.invoke({"context": context, "question": query})
    
    sources = [
        {
            "content": d.page_content,
            "page": d.metadata.get('page', 'N/A'),
            "document_id": d.metadata.get('document_id')
        } for d in docs
    ]
    
    return {
        "answer": response.content,
        "sources": sources
    }

def generate_summary(user_id, document_id):
    # Fetch top 10 chunks from the document to summarize
    retriever = get_retriever(user_id, document_id, k=10)
    # A generic query to fetch diverse parts of the document
    docs = retriever.invoke("main topics core concepts summary")
    
    context = "\n\n".join([d.page_content for d in docs])
    
    prompt = PromptTemplate.from_template(
        "You are an expert study assistant. Summarize the following document excerpts into a comprehensive and easy-to-read study guide. "
        "Use bullet points and bold text for key concepts.\n\n"
        "Document Excerpts:\n{context}\n\n"
        "Study Summary:"
    )
    
    llm = get_llm()
    chain = prompt | llm
    
    response = chain.invoke({"context": context})
    return response.content

def generate_mcq(user_id, document_id, count=5):
    retriever = get_retriever(user_id, document_id, k=10)
    docs = retriever.invoke("important facts core concepts testable material")
    
    context = "\n\n".join([d.page_content for d in docs])
    
    prompt = PromptTemplate.from_template(
        "You are an expert professor creating an exam. Based on the following document excerpts, create {count} multiple-choice questions.\n"
        "You MUST return the output ONLY as a raw JSON array of objects. Do not include markdown formatting like ```json. \n"
        "Each object must have exactly these keys: 'question' (string), 'options' (array of 4 strings), and 'correctAnswer' (string, must exactly match one of the options), 'explanation' (string).\n\n"
        "Context:\n{context}\n\n"
        "JSON Output:"
    )
    
    llm = get_llm()
    chain = prompt | llm
    
    response = chain.invoke({"context": context, "count": count})
    content = response.content.strip()
    
    if content.startswith("```json"):
        content = content[7:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
        
    try:
        return json.loads(content.strip())
    except json.JSONDecodeError:
        print(f"Failed to parse MCQ JSON: {content}")
        return []
