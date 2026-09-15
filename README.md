# 🚗 ParkSmart AI — Automatic Parking Slot Booking System

> Smart parking management with real-time slot availability, AI-powered license plate recognition (ALPR), and dynamic pricing.

---

## 🏗️ Project Architecture & Tech Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| **Backend** | Spring Boot 3 + Spring Security + JWT | REST APIs, authentication, slots, bookings, dynamic pricing |
| **ML Service** | Python 3 + Flask + Scikit-Learn | License plate detection & 24-hour parking demand forecasting |
| **Database** | PostgreSQL (Render Cloud) / H2 Embedded (Local) | Persistent storage for users, vehicles, slots, and bookings |
| **Real-time** | WebSocket (STOMP + SockJS) | Live slot status broadcast on `/topic/slots` |
| **Passes** | ZXing QR Code | Automated entry/exit pass generation |

---

## 📁 Repository Structure

```
ParkSmart/
├── backend/            # Spring Boot REST API service (Java 17)
├── ml-service/         # Python Flask ML microservice (Demand & Plate Detection)
├── frontend/           # React + Tailwind CSS web application (Frontend Team)
├── docs/               # API Postman collection
│   └── ParkSmart-Postman-Collection.json
└── render.yaml         # 1-Click Render Cloud deployment blueprint
```

---

## 🚀 Quick Start (Local Development)

### 1. Backend Service (`port 8081`)
```bash
cd backend
mvn clean package -DskipTests
java -jar target/parksmart-backend-0.0.1-SNAPSHOT.jar
```

### 2. ML Service (`port 5001`)
```bash
cd ml-service
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/python app.py
```

---

## 🔐 Demo Credentials (Seeded Automatically)

| Role | Email | Password |
|------|-------|----------|
| **ADMIN** | `admin@parksmart.com` | `admin123` |
| **USER** | `aakash@parksmart.com` | `user123` |
| **GUARD** | `guard@parksmart.com` | `guard123` |

---

## 📡 API Reference

Import `docs/ParkSmart-Postman-Collection.json` into Postman for full request/response specs.
