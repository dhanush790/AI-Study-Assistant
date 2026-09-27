\# AI Study Assistant using RAG



An AI-powered study assistant that uses Retrieval-Augmented Generation (RAG)

to answer questions based on uploaded study materials.



\## Features



\- Upload study documents

\- Extract and process document text

\- Split documents into meaningful chunks

\- Generate text embeddings

\- Store embeddings in a vector database

\- Semantic document retrieval

\- AI-powered question answering

\- User authentication

\- Chat-based study interface

\- Source-based answers



\## Architecture



User

↓

React Frontend

↓

Django REST API

↓

Document Processing

↓

Chunking

↓

Embeddings

↓

ChromaDB

↓

Semantic Retrieval

↓

LLM

↓

Context-Aware Answer



\## Tech Stack



\### Frontend

\- React

\- Vite

\- Tailwind CSS



\### Backend

\- Python

\- Django

\- Django REST Framework



\### AI / RAG

\- Retrieval-Augmented Generation

\- Embeddings

\- ChromaDB

\- LLM



\### Database

\- SQL / Django ORM



\## Project Structure



```text

ai-study-assistant/

├── backend/

│   ├── manage.py

│   ├── config/

│   └── ...

├── frontend/

│   ├── src/

│   ├── package.json

│   └── ...

├── .gitignore

└── README.md

