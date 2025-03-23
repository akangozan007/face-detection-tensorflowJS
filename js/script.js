let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const setupCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 600, height: 400 },
            audio: false,
        });
        video.srcObject = stream;
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
};

const detectFaces = async () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Kosongkan kanvas sebelum menggambar video

    ctx.drawImage(video, 0, 0, 600, 400);

    const prediction = await model.estimateFaces(video, false);

    prediction.forEach((pred) => {
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "blue";
        ctx.rect(
            pred.topLeft[0],
            pred.topLeft[1],
            pred.bottomRight[0] - pred.topLeft[0],
            pred.bottomRight[1] - pred.topLeft[1]
        );
        ctx.stroke();
    });
};



setupCamera();
video.addEventListener("loadeddata", async () => {
    model = await blazeface.load();
    console.log("Model loaded:", model); // Tambahkan log untuk cek apakah model telah dimuat
    setInterval(detectFaces, 100);
});

