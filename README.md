# 🎓 AI Study Assistant

A full-stack AI-powered study companion that helps you learn faster. Upload your lecture notes, textbooks, and research papers, and chat directly with your documents. Automatically generate study guides and interactive multiple-choice quizzes!

## ✨ Features
* **AI Document Chat:** Uses advanced RAG (Retrieval-Augmented Generation) to ground the AI strictly in your uploaded materials.
* **Source Citations:** Every answer from the AI includes the exact text snippet and source document it used.
* **Study Guides:** Instantly generate comprehensive Markdown summaries of any uploaded PDF, DOCX, or TXT file.
* **Interactive Quizzes:** Test your knowledge with dynamically generated 5-question multiple-choice quizzes.
* **Secure Dashboard:** JWT authentication, user isolation, rate limiting, and a beautiful Tailwind CSS dashboard.

## 🛠️ Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Lucide React
* **Backend:** Django, Django REST Framework
* **AI & LLM:** LangChain, Groq API (`gpt-oss-20b`), HuggingFace Sentence Transformers (`all-MiniLM-L6-v2`)
* **Vector Database:** ChromaDB (Local SQLite)
* **Deployment:** Docker & Docker Compose

## 🚀 Quick Start (Docker)

1. Clone the repository
2. Set up your Groq API key:
   ```bash
   export GROQ_API_KEY="your_api_key_here"
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
4. Access the frontend at `http://localhost:80` and the backend at `http://localhost:8000`.

## 💻 Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate # Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security Features
- Strict file extension and size validation.
- Endpoints are protected by DRF throttling (`1000/day`).
- Document vector isolation ensures users can only query their own files.
