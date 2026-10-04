#!/bin/bash
set -e

echo "=========================================="
echo "Starting ParkSmart AI Unified Container"
echo "=========================================="

# 1. Start ML Microservice in the background on port 5001
echo "Starting Python ML Microservice on port 5001..."
cd /app/ml-service
/app/ml-service/venv/bin/gunicorn app:app --bind 127.0.0.1:5001 --workers 1 --threads 2 --timeout 120 &
ML_PID=$!

# Wait for ML service to become healthy
echo "Waiting for ML Service to be ready..."
for i in {1..30}; do
    if curl -s http://127.0.0.1:5001/health > /dev/null; then
        echo "ML Microservice is ready!"
        break
    fi
    sleep 1
done

# 2. Set default environment variables for Backend
export ML_SERVICE_URL="http://127.0.0.1:5001"
export PORT="${PORT:-8080}"

echo "Starting Spring Boot Backend on port $PORT (Memory Capped at 256MB)..."
cd /app
exec java -Xmx256m -Xms128m -jar /app/backend.jar --spring.profiles.active=prod
