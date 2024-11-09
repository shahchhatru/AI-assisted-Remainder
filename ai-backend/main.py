from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from llm_inference.src.llm_inference.inference import html_parser, required_content_bool

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run_prompt")
async def api_run_prompt(content: str, user_req: str):
    try:
        parsed_response = await html_parser(content)
        required_content = await required_content_bool(parsed_response, user_req)
        return {"response": required_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)
