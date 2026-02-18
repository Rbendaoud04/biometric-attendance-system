# 🧠 Biometric Attendance System

> AI-powered attendance platform using **facial recognition** and **gesture-based registration** with real-time liveness detection.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

---

## 📌 Overview

The **Biometric Attendance System** eliminates manual check-ins by verifying real user presence through wave-gesture detection and facial recognition. It securely stores face embeddings and automates attendance logging through a real-time recognition pipeline.

**Key capabilities:**

- 👋 Gesture-based (wave detection) registration flow to confirm live presence
- 🧬 Secure face embedding storage — no raw images stored
- 📋 Automated attendance logging with timestamps
- ⚡ Real-time recognition pipeline
- 🔒 Privacy-first architecture

---

## 🗂️ Project Structure

```
biometric-attendance-system/
├── ai/              # ML models: face recognition, liveness/gesture detection
├── backend/         # API server, business logic, database layer
├── frontend/        # Web/mobile UI
├── infra/           # Docker, CI/CD, cloud infrastructure configs
└── docs/            # Architecture diagrams, API specs, guides
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- A webcam or compatible camera device

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/biometric-attendance-system.git
cd biometric-attendance-system

# 2. Start all services
docker compose up --build

# 3. Or run individually — see each folder's README for details
```

> Refer to [`docs/`](./docs) for detailed setup guides per module.

---

## 🧱 Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| AI/ML    | Python, OpenCV, DeepFace / InsightFace, MediaPipe |
| Backend  | FastAPI / Node.js, PostgreSQL, Redis              |
| Frontend | React / Next.js                                   |
| Infra    | Docker, GitHub Actions, AWS / GCP                 |

---

## 🔐 Security & Privacy

- Face embeddings are stored as encrypted vectors — **raw images are never persisted**
- All API endpoints are authenticated via JWT
- Gesture-based liveness check prevents spoofing via photos or videos
- Compliant with data minimization principles

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 📬 Contact

Have questions or ideas? Open an [issue](https://github.com/your-org/biometric-attendance-system/issues) or reach out to the maintainers.
