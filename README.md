# Multimodal AI Researcher Assistant — PoC
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white&labelColor=20232A)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai&logoColor=white)
![Status](https://img.shields.io/badge/Status-Proof_of_Concept-orange)


This project is a proof of concept (PoC) that demonstrates how multimodal large language models (LLMs) can be applied to complex research tasks by combining vision, text analysis, and real-time web search capabilities.

The focus of this PoC is not full production scalability, but validating the **seamless integration of vision and text**, **mathematical rendering quality**, and **user experience** under real-world research constraints.

<img width="1169" height="731" alt="image" src="https://github.com/user-attachments/assets/b8ac3f16-4bbb-45bf-8d6a-af1b89b8f782" />


## 🎯 Problem Statement
Advanced research often requires more than just text-based interactions. Researchers and developers face specific challenges:

*   **Visual Context:** Questions often relate to charts, diagrams, or physical objects that text cannot fully describe.
*   **Stale Information:** Standard LLMs have knowledge cut-offs; research requires up-to-date web data.
*   **Formatting Constraints:** Scientific output containing mathematical formulas (LaTeX) and code blocks is often poorly rendered in standard chat interfaces.

This PoC explores how to unify **GPT-4o's vision capabilities** with **Web Search** tools in a single, polished UI to solve these friction points.

## 🚀 What This PoC Demonstrates
*   **Multimodal Analysis:** Simultaneous processing of high-resolution images and complex text queries using GPT-4o.
*   **Real-Time Web Research:** Autonomous decision-making by the model to perform web searches when current data is needed.
*   **Scientific Rendering Engine:** A specialized frontend pipeline using `KaTeX` and `React Markdown` to render complex mathematical equations ($E=mc^2$) and tables perfectly.
*   **Context-Aware Memory:** Maintains conversational context across turns using a `previous_response_id` mechanism.
*   **Modern UX Architecture:** A clean, responsive interface built with Tailwind CSS and Lucide icons, distinguishing clearly between user input and AI analysis.

## 🏗 High-Level Architecture
1.  **Input:** The user uploads an image or types a query through the React interface.
2.  **Payload Construction:** The frontend converts images to Data URIs and packages them with the text prompt.
3.  **API Gateway:** FastAPI receives the payload and manages CORS and request validation via Pydantic models.
4.  **Orchestration:**
    *   The system initializes the OpenAI client with specific instructions.
    *   If the query requires external data, the `web_search` tool is triggered automatically.
    *   If an image is present, it is processed via the Vision endpoint.
5.  **Generation:** GPT-4o generates a markdown-formatted response.
6.  **Rendering:** The frontend parses the response, rendering LaTeX math, code blocks, and standard markdown in real-time.

## 🛠 Technology Stack
*   **Python 3.10+**
*   **FastAPI:** High-performance Backend API
*   **React (Vite + TS):** Reactive User Interface
*   **OpenAI GPT-4o:** Multimodal Reasoning Model
*   **Tailwind CSS:** Styling Framework
*   **KaTeX / Remark:** Mathematical & Markdown Rendering

## ⚖️ Design Decisions and Trade-Offs

### Direct Data URI for Images
The PoC sends images directly as Base64 Data URIs to the API.
*   **Why:** To simplify the architecture for the PoC and avoid the complexity of setting up a separate object storage service (like S3 or Azure Blob) during the validation phase.
*   **Trade-off:** Increases payload size, which is acceptable for single-user testing but would need optimization in production.

### Client-Side State Management
Conversation history is currently held in the Frontend state.
*   **Why:** To ensure immediate UI responsiveness and reduce backend database overhead during the prototyping of the interaction model.
*   **Future:** A persistent database (PostgreSQL/Redis) would be required for long-term history storage.

### Synchronous Processing
The chat endpoint waits for the full generation before responding.
*   **Why:** To ensure the integrity of the markdown and math syntax before rendering.
*   **Trade-off:** Users see a loader instead of a stream. Streaming responses would be the next step for UX improvement.

## ⚠️ PoC Scope and Known Limitations
This PoC intentionally does not include:
*   User Authentication (OAuth/JWT).
*   Persistent database storage for chat history (Session-based only).
*   File storage buckets (Images are transient).
*   Streaming API responses (Server-Sent Events).

## 🔮 Production-Oriented Next Steps
If extended beyond PoC, the following areas would be addressed:
*   **Streaming Support:** Implementing SSE for typewriter-effect responses.
*   **Storage Layer:** Integrating AWS S3 or Azure Blob for image handling.
*   **Vector Memory:** Adding a vector database (Pinecone/Chroma) for long-term research memory.
*   **Containerization:** Dockerizing frontend and backend for orchestration (K8s).

## 🚀 Quick Start & How to Use
Follow these steps to set up and run the project locally on your machine.

### 1. Backend Setup
Navigate to the backend directory (root where `main.py` exists):

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn python-dotenv openai pydantic
```

Create a `.env` file in the root directory and add your OpenAI API Key:

```env
OPENAI_API_KEY="sk-your-openai-api-key"
```

Start the Server:
```bash
uvicorn main:app --reload
```
*Server runs at: http://localhost:8000*

### 2. Frontend Setup
Navigate to the frontend directory:

```bash
cd frontend
npm install
```

Make sure specific rendering libraries are installed:
```bash
npm install react-markdown remark-math remark-gfm rehype-katex lucide-react
```

Start the Application:
```bash
npm run dev
```
*App runs at: http://localhost:5173*

## 📖 Usage Guide
Once the application is running:

1.  **Visual Analysis:** Click the **Paperclip** icon to upload a diagram, chart, or photo. Ask a question like *"Analyze the trend in this chart."*
2.  **Deep Research:** Ask a question requiring current data, e.g., *"What were the latest stock market trends for AI companies yesterday?"*. The system will auto-trigger web search.
3.  **Math & Code:** Try asking for a formula: *"Explain the Black-Scholes equation."* Observe the LaTeX rendering.

## 👨‍💻 Author
Umit Sener
