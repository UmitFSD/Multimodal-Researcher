import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from typing import Optional

load_dotenv()

# OpenAI Client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# CORS settings for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str 
    image: Optional[str] = None
    previous_response_id: Optional[str] = None 

@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        # Bu API (Responses API) içerik tipleri için 'input_text' ve 'input_image' isimlerini zorunlu kılar.
        user_content = []
        
        # 1. Metin kısmını ekle (Tipi: 'input_text', Anahtarı: 'text')
        user_content.append({
            "type": "input_text",
            "text": req.message
        })
        
        # 2. Resim kısmını ekle (Tipi: 'input_image', Anahtarı: 'image_url')
        if req.image:
            print("📷 Request contains an image.")
            user_content.append({
                "type": "input_image",
                "image_url": req.image  # Frontend'den gelen tam veriyi (data URI) direkt gönderiyoruz
            })

        api_params = {
            "model": "gpt-4o",
            "input": [
                {
                    "role": "user",
                    "content": user_content
                }
            ],
            "tools": [{"type": "web_search"}]
        }
        
        # Hafıza Yönetimi ve Talimatlar
        if req.previous_response_id:
            api_params["previous_response_id"] = req.previous_response_id
        else:
            api_params["instructions"] = (
                "You are a Multimodal Research Assistant. "
                "Analyze images in detail and provide high-quality research reports. "
                "Use web_search for up-to-date information. "
                "Always respond in English using clear Markdown formatting."
            )

        # API Çağrısı
        response = client.responses.create(**api_params)

        final_text = ""
        if response.output:
            for item in response.output:
                if item.type == "message" and item.content:
                    for part in item.content:
                        # Yanıt her zaman 'output_text' tipinde gelir
                        if part.type == "output_text":
                            final_text += part.text

        return {
            "response": final_text,
            "response_id": response.id
        }

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return {"response": f"Server Error: {str(e)}", "response_id": None}