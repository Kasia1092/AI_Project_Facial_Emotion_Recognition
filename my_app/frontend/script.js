const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewBox = document.getElementById('previewBox');
const cameraBox = document.getElementById('cameraBox');
const video = document.getElementById('video');
const resultBox = document.getElementById('resultBox');
const emotionLabel = document.getElementById('emotionLabel');
const confidenceLabel = document.getElementById('confidenceLabel');
const canvas = document.getElementById('canvas');

const actionButtons = document.getElementById('actionButtons');
const cropActions = document.getElementById('cropActions');

let currentBlob = null;
let stream = null;
let cropper = null;

function triggerFileInput() {
    stopCamera();
    imageInput.click();
}

imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
});

async function startCamera() {
    previewBox.style.display = 'none';
    resultBox.style.display = 'none';
    
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        cameraBox.style.display = 'block';
    } catch (err) {
        alert("No camera access!");
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        cameraBox.style.display = 'none';
    }
}

function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob(function(blob) {
        loadImage(blob);
        stopCamera();
    }, 'image/jpeg');
}

function loadImage(fileOrBlob) {
    currentBlob = fileOrBlob;
    
    const url = URL.createObjectURL(fileOrBlob);
    imagePreview.src = url;
    
    previewBox.style.display = 'block';
    resultBox.style.display = 'none';
    
    actionButtons.style.display = 'flex';
    cropActions.style.display = 'none';
    
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

function enableCropper() {
    actionButtons.style.display = 'none';
    cropActions.style.display = 'block';
    
    cropper = new Cropper(imagePreview, {
        aspectRatio: 1,
        viewMode: 1
    });
}

function confirmCrop() {
    if (!cropper) return;
    
    cropper.getCroppedCanvas().toBlob((blob) => {
        loadImage(blob);
    }, 'image/jpeg');
}

function cancelCrop() {
    loadImage(currentBlob);
}

async function predictEmotion() {
    if (!currentBlob) return;
    
    const selectedModel = document.getElementById('modelSelect').value;

    const formData = new FormData();
    formData.append("file", currentBlob);
    formData.append("model_name", selectedModel); 
    
    emotionLabel.innerText = "Analyzing...";
    confidenceLabel.innerText = "";
    resultBox.style.display = 'block';
    
    try {
        const response = await fetch("http://127.0.0.1:8001/predict", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        
        if(data.error) {
            alert(data.error);
        } else {
            console.log("Model used:", data.model_used);
            emotionLabel.innerText = data.emotion.toUpperCase();
            confidenceLabel.innerText = data.confidence;
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}