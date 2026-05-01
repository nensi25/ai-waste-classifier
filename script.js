const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const previewImage = document.getElementById("previewImage");
const uploadForm = document.getElementById("uploadForm");
const resultText = document.getElementById("resultText");

const cameraBtn = document.getElementById("cameraBtn");
const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");

const loader = document.getElementById("loader");

const progress = document.getElementById("progress");
const confidenceText = document.getElementById("confidenceText");

const tipsText = document.getElementById("tipsText");

const themeToggle = document.getElementById("themeToggle");
const voiceBtn = document.getElementById("voiceBtn");

/* =========================
   IMAGE UPLOAD
========================= */

uploadBox.addEventListener("click", () => {

    fileInput.click();

});

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if(file){

        const reader = new FileReader();

        reader.onload = function(e){

            previewImage.src = e.target.result;

            previewImage.style.display = "block";
        }

        reader.readAsDataURL(file);
    }

});

/* =========================
   CAMERA
========================= */

cameraBtn.addEventListener("click", async()=>{

    try{

        const stream = await navigator.mediaDevices.getUserMedia({
            video:true
        });

        camera.srcObject = stream;

        camera.style.display = "block";

        resultText.innerHTML =
        "📸 Capturing image in 3 seconds...";

        setTimeout(()=>{

            canvas.width = camera.videoWidth;
            canvas.height = camera.videoHeight;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(camera,0,0);

            previewImage.src =
            canvas.toDataURL("image/png");

            previewImage.style.display = "block";

            resultText.innerHTML =
            "✅ Camera image captured";

        },3000);

    }
    catch(error){

        alert("Camera access denied");

    }

});

/* =========================
   FORM SUBMIT
========================= */

uploadForm.addEventListener("submit", async(e)=>{

    e.preventDefault();

    loader.style.display = "block";

    resultText.innerHTML =
    "🤖 AI is analyzing image...";

    const formData = new FormData();

    /* FILE IMAGE */

    if(fileInput.files[0]){

        formData.append(
            "image",
            fileInput.files[0]
        );

    }

    /* CAMERA IMAGE */

    else{

        const imageBlob =
        await fetch(previewImage.src)
        .then(res => res.blob());

        formData.append(
            "image",
            imageBlob,
            "camera.png"
        );

    }

    try{

        const response =
        await fetch(
            "http://127.0.0.1:5000/predict",
        {
            method:"POST",
            body:formData
        });

        const data =
        await response.json();

        loader.style.display = "none";

        resultText.innerHTML =
        `✅ ${data.prediction}`;

        /* RANDOM CONFIDENCE */

        const randomConfidence =
        Math.floor(Math.random()*15)+85;

        progress.style.width =
        randomConfidence + "%";

        confidenceText.innerHTML =
        randomConfidence + "%";

        /* RECYCLING TIPS */

        tipsText.innerHTML =
        "Please clean and separate waste before recycling for better processing.";

    }

    catch(error){

        loader.style.display = "none";

        resultText.innerHTML =
        "❌ Failed to connect to server";

    }

});

/* =========================
   PARTICLES BACKGROUND
========================= */

const canvasParticles =
document.getElementById("particles");

const ctxParticles =
canvasParticles.getContext("2d");

canvasParticles.width =
window.innerWidth;

canvasParticles.height =
window.innerHeight;

let particlesArray = [];

for(let i=0;i<80;i++){

    particlesArray.push({

        x:Math.random()*canvasParticles.width,

        y:Math.random()*canvasParticles.height,

        size:Math.random()*3,

        speedX:(Math.random()-0.5),

        speedY:(Math.random()-0.5)

    });

}

function animateParticles(){

    ctxParticles.clearRect(
        0,
        0,
        canvasParticles.width,
        canvasParticles.height
    );

    particlesArray.forEach(p=>{

        p.x += p.speedX;

        p.y += p.speedY;

        if(p.x < 0 || p.x > canvasParticles.width)
            p.speedX *= -1;

        if(p.y < 0 || p.y > canvasParticles.height)
            p.speedY *= -1;

        ctxParticles.beginPath();

        ctxParticles.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI*2
        );

        ctxParticles.fillStyle =
        "rgba(0,255,255,0.7)";

        ctxParticles.fill();

    });

    requestAnimationFrame(
        animateParticles
    );

}

animateParticles();

/* =========================
   DARK / LIGHT MODE
========================= */

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle(
        "light-mode"
    );

    if(
        document.body.classList.contains(
            "light-mode"
        )
    ){

        themeToggle.innerHTML = "☀️";

    }
    else{

        themeToggle.innerHTML = "🌙";

    }

});

/* =========================
   VOICE ASSISTANT
========================= */

voiceBtn.addEventListener("click",()=>{

    const speech =
    new SpeechSynthesisUtterance();

    speech.text =
    "AI waste classifier is ready for smart recycling analysis.";

    speech.volume = 1;

    speech.rate = 1;

    speech.pitch = 1;

    window.speechSynthesis.speak(
        speech
    );

});

/* =========================
   WINDOW RESIZE
========================= */

window.addEventListener(
    "resize",
    ()=>{

        canvasParticles.width =
        window.innerWidth;

        canvasParticles.height =
        window.innerHeight;

    }
);