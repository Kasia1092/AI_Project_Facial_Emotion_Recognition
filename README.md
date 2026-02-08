# AI Emotion Detector

![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?style=flat-square)

**AI Emotion Detector** is my project for the **Artificial Intelligence** subject.

I trained a **CNN (Convolutional Neural Network)** to recognize human emotions from faces, and evaluated it using SHAP. I also created a simple web app so you can test the model using your camera or by uploading photos.

## 📂 Dataset
I used the **[FER-2013 Dataset](https://www.kaggle.com/datasets/msambare/fer2013/data)** from Kaggle to train the model.
* **Images:** Small grayscale photos (48x48 pixels).
* **7 Emotions:** Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral
---

## 🚀 How to Run It

### 1. Install Requirements

```bash
pip install -r requirements.txt
```

### 2. Start the Backend
Go into the backend folder and start the server:

```bash
cd my_app/backend
uvicorn main:app --reload --port 8001
```

### 3. Open the App
You don't need a server for the frontend. Just go to the frontend folder and double-click **index.html** to open it in your browser.

## 🎮 How to Use

- Pick a Model: Select "My Model" (the one I trained) or you can add and use your own - save the file in the models folder and update the path in main.py.

- Get a Photo: Click Camera to take a selfie or Upload to choose a file.

- Crop the Face: Use the crop tool to select just the face (this helps the AI guess better).

- Check Result: Click the button to see the predicted emotion!
