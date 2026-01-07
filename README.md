# 🔍 Multimodal Researcher (POC)
Multimodal Visual Analysis + Real-Time Web Research Assistant

![Project Status](https://img.shields.io/badge/Status-POC%20%2F%20Demo-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech](https://img.shields.io/badge/AI-GPT--4o-green)

**Multimodal Researcher** is a Proof of Concept (POC) application that leverages **OpenAI's GPT-4o** model to perform deep research tasks using both **text and image inputs**.

Unlike standard chatbots, this agent can "see" images and autonomously browse the web to provide up-to-date, citation-backed answers. It maintains conversation context using OpenAI's stateful Responses API.

---

## 📸 Screenshots

| Visual Analysis | Deep Web Research |
|:---:|:---:|
| <img src="assets/demo_screenshot_1.jpg" width="400" alt="Visual Input"> | <img src="assets/demo_screenshot_2.jpg" width="400" alt="Research Output"> |
| *User uploads an image for analysis* | *Agent browses the web for real-time info* |

*(Note: Replace `assets/demo_screenshot_X.jpg` with your actual image paths)*

---

## ✨ Key Features

* **🧠 Multimodal Intelligence:** Analyze images and text simultaneously using `gpt-4o`.
* **🌐 Real-Time Web Search:** Equipped with the `web_search` tool to fetch current events (2024-2026 data).
* **💬 Contextual Memory:** Maintains conversation continuity via `response_id` chaining (Stateful API).
* **🎨 Modern UI:** Clean, responsive interface built with React, Tailwind CSS, and Lucide Icons.
* **📝 Markdown Support:** Renders complex reports with proper formatting.

---

## 🛠️ Tech Stack

### Frontend
* **React** (Vite)
* **Tailwind CSS** (Styling)
* **Lucide React** (Icons)
* **React Markdown** (Rendering)

### Backend
* **Python** (FastAPI)
* **OpenAI SDK** (Responses API / GPT-4o)
* **Pydantic** (Data Validation)

---

## 🚀 Getting Started

Follow these steps to run the POC locally.

### Prerequisites
* Node.js (v18+)
* Python (3.10+)
* OpenAI API Key (with access to `gpt-4o`)

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/multimodal-researcher.git](https://github.com/yourusername/multimodal-researcher.git)
cd multimodal-researcher
