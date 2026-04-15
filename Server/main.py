import os
import json
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import requests

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + GEMINI_API_KEY

app = FastAPI(title="Gemini Chat API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    storyType: str

@app.post("/story")
async def get_story(req: ChatRequest):
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"""Give me a short story based on the requested story type.

Requested Story Type: {req.storyType}

Respond with suitable emojis.

Do NOT wrap in markdown.
Do NOT include ```json or ```.

Return STRICT JSON only.

Respond ONLY in the following JSON format:
{{
    "StoryTitle": "title here",
    "StoryContent": "content here"
}}
"""
                    }
                ]
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(GEMINI_URL, headers=headers, json=payload)
    print("code:", response.status_code)
    if response.status_code != 200:
        return {"error": response.text}

    data = response.json()

    try:
        story = data["candidates"][0]["content"]["parts"][0]["text"]
        return story
    except Exception as e:
        print("Error:", e)
        return {"error": "Invalid response from Gemini", "details": str(e)}






  
