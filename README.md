# Multimodal Researcher Assistant — PoC

This project is an **Enterprise-grade** proof of concept (PoC) that demonstrates how to build a **Multimodal AI Agent** capable of "seeing" images and performing **real-time web research** to ground its answers.

The focus of this PoC is not full production scalability, but validating the **agentic workflow** between Visual Input, LLM reasoning, and external Web Search tools using OpenAI's modern stateful API architecture.

## 📸 Interface Preview

<div style="display: flex; gap: 10px;">
  <img src="assets/demo_screenshot_1.jpg" alt="Visual Input" width="45%">
  <img src="assets/demo_screenshot_2.jpg" alt="Research Output" width="45%">
</div>

---

## 🎯 Problem Statement

Standard Chatbots and RAG systems often face two major limitations:
1.  **Blindness:** They cannot interpret visual data (images, charts, physical objects) natively alongside text.
2.  **Static Knowledge:** They rely on training data cut-offs, making them useless for breaking news or real-time fact-checking.

This PoC explores how to create a unified assistant that bridges **Vision** and **Live Information**, allowing users to upload a photo of an unknown object/place and ask: *"What is this, and what are the latest news about it?"*

## 🚀 What This PoC Demonstrates

* **Multimodal Reasoning:** Seamlessly combines `text` and `image_url` inputs in a single API call using GPT-4o.
* **Agentic Web Search:** The model autonomously decides when to use the `web_search` tool based on the user's prompt.
* **Stateful API Usage:** Instead of a complex vector database for conversation history, this PoC leverages OpenAI's `previous_response_id` to maintain context threads efficiently.
* **Grounded Answers:** Responses are not just generated; they are researched and cited from active web sources (2024-2026 data).
* **Modern Frontend:** A reactive, clean interface built with React/Vite that handles file streams and markdown rendering.

## 🏗 High-Level Architecture

1.  **Input:** User uploads an image and types a query via the **React** interface.
2.  **Processing:**
    * The image is converted to a Data URI on the client side.
    * The payload (Image + Text) is sent to the **FastAPI** backend.
3.  **Agent Logic:**
    * The backend constructs a request to **OpenAI Responses API**.
    * It injects the `previous_response_id` (if available) to restore memory.
4.  **Execution:**
    * **GPT-4o** analyzes the image.
    * If needed, it triggers the **Web Search Tool** to fetch external data.
5.  **Response:** The final synthesized answer (Markdown) is returned and rendered.

## 🛠 Technology Stack

* **Python 3.10+**
* **FastAPI:** High-performance Backend API
* **OpenAI GPT-4o:** Multimodal LLM & Reasoning Engine
* **OpenAI Web Search Tool:** Real-time information retrieval
* **React (Vite):** Frontend Framework
* **Tailwind CSS:** Styling
* **Lucide React:** Iconography

## ⚖️ Design Decisions and Trade-Offs

### **API-Side State Management**
* **Decision:** The PoC uses OpenAI's `previous_response_id` parameter to handle conversation history.
* **Why:** To avoid the complexity of setting up Redis or Postgres for a lightweight PoC. This delegates context window management to the model provider.
* **Trade-off:** History is ephemeral to the session sequence; if the ID chain breaks, context is lost.

### **Direct Image Payload**
* **Decision:** Images are sent as Base64 Data URIs directly in the JSON payload.
* **Why:** Simulates a "serverless" approach without needing an intermediate S3 bucket or Blob Storage for temporary uploads.
* **Trade-off:** Increases the payload size of the HTTP request, which is acceptable for a PoC but would require optimized storage strategies in production.

### **Synchronous Agent Flow**
* **Decision:** The request waits for the full research cycle (Image Analysis -> Search -> Synthesis) before responding.
* **Why:** Ensures the user receives a complete, verified answer rather than a partial stream.
* **Future:** Server-Sent Events (SSE) would be introduced for better perceived latency in production.

## ⚠️ PoC Scope and Known Limitations

This PoC intentionally **does not** include:
* User Authentication / Multi-tenancy
* Persistent Database (History is RAM/Session based)
* Streaming responses (currently request/response cycle)
* PDF/Document parsing (Focus is on Image/Web)

## 🔮 Production-Oriented Next Steps

If extended beyond PoC, the following areas would be addressed:
1.  **Persistence:** Integration with PostgreSQL/Supabase to store chat sessions.
2.  **Storage:** AWS S3 or Azure Blob integration for handling high-res image uploads.
3.  **Streaming:** Implementing streaming support on FastAPI/React for long research tasks.
4.  **Export:** Ability to export the research results as PDF/Markdown reports.

## 🚀 Quick Start & How to Use

Follow these steps to set up and run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/multimodal-researcher.git](https://github.com/yourusername/multimodal-researcher.git)
cd multimodal-researcher

2. Configure Backend
Navigate to the backend, create environment variables, and run.

cd backend
# Create .env file and add: OPENAI_API_KEY="sk-..."
pip install -r requirements.txt
uvicorn main:app --reload

3. Run Frontend
Open a new terminal for the client.

cd frontend
npm install
npm run dev

The application will open at http://localhost:5173.

📖 Usage Guide
Upload: Click the clip icon to upload an image (e.g., a photo of a landmark, a gadget, or a chart).

Ask: Type a question like "What is the release date and price of the product in this image?"

Research: The agent will recognize the object, search the web for the latest details, and answer.

👨‍💻 Author
Umit Sener
