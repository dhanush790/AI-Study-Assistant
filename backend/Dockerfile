FROM python:3.10-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies for sentence-transformers and build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install gunicorn

# Copy project files
COPY . /app/

# Expose port so Render knows where to route
EXPOSE 10000

# Make entrypoint executable
RUN chmod +x entrypoint.sh

# Run entrypoint
CMD ["./entrypoint.sh"]
