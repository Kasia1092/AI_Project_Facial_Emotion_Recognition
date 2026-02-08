from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models = {}

model_paths = {
    "my_model": "../../models/my_model.keras",
}

print("--- Loading models ---")
for name, path in model_paths.items():
    if os.path.exists(path):
        try:
            print(f"Loading {name} from {path}...")
            models[name] = tf.keras.models.load_model(path, compile=False)
            print(f"Model {name} ready")
        except Exception as e:
            print(f"Error loading {name}: {e}")
    else:
        print(f"File not found: {path}")

CLASS_NAMES = ['angry', 'fear', 'happy', 'neutral', 'sad', 'surprise']

def prepare_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('L')
    img = img.resize((48, 48))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    img_array = np.expand_dims(img_array, axis=-1)
    return img_array

@app.post("/predict")
async def predict_emotion(
    file: UploadFile = File(...),
    model_name: str = Form(...)
):
    if model_name not in models:
        return {"error": f"Model '{model_name}' is not available"}
    
    selected_model = models[model_name]

    contents = await file.read()
    try:
        processed_image = prepare_image(contents)
        
        prediction = selected_model.predict(processed_image)
        
        idx = np.argmax(prediction)
        return {
            "model_used": model_name,
            "emotion": CLASS_NAMES[idx],
            "confidence": f"{float(np.max(prediction)) * 100:.2f}%"
        }
    except Exception as e:
        return {"error": str(e)}