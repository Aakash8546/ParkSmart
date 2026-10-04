# ==========================================
# Stage 1: Build Spring Boot Backend JAR
# ==========================================
FROM maven:3.9-eclipse-temurin-17 AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Final Runtime (Java 17 + Python 3)
# ==========================================
FROM eclipse-temurin:17-jre-jammy

# Install Python 3 and pip
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Setup Python ML Microservice
COPY ml-service /app/ml-service
WORKDIR /app/ml-service
RUN python3 -m venv /app/ml-service/venv && \
    /app/ml-service/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /app/ml-service/venv/bin/pip install --no-cache-dir -r requirements.txt

# Setup Backend JAR
WORKDIR /app
COPY --from=backend-builder /app/backend/target/parksmart-backend-0.0.1-SNAPSHOT.jar /app/backend.jar

# Setup Startup Script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 8080

CMD ["/app/start.sh"]
