const cam = document.querySelector('#video')

Promise.all([ 

    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // É igual uma detecção facial normal, porém menor e mais rapido
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // Pegar os pontos de referencia do sue rosto. Ex: olhos, boca, nariz, etc...
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // Vai permitir a api saber onde o rosto está localizado no video
    faceapi.nets.faceExpressionNet.loadFromUri('/models') // Vai permitir a api saber suas expressões. Ex: se esta feliz, triste, com raiva, etc...

]).then(startVideo)

async function startVideo() {
    const constraints = { video: true };

    try {
        let stream = await navigator.mediaDevices.getUserMedia(constraints);

        cam.srcObject = stream;
        cam.onloadedmetadata = e => {
            cam.play();
        }

    } catch (err) {
        console.error(err);
    }
}

cam.addEventListener('play', () => {

    const canvas = faceapi.createCanvasFromMedia(video) 
    document.body.append(canvas) 

    const displaySize = { width: cam.width, height: cam.height } 

    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => { 
        const detections = await faceapi.detectAllFaces(
            cam, 
            new faceapi.TinyFaceDetectorOptions() 

        )
            .withFaceLandmarks() 
            .withFaceExpressions() 


        const resizedDetections = faceapi.resizeResults(detections, displaySize) 


        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height) 

        faceapi.draw.drawDetections(canvas, resizedDetections) 
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    }, 100);
})