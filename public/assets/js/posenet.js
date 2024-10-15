async function setupPoseNet() {
    const video = document.getElementById('video');
    
    const net = await posenet.load();
    
    // Load the video stream
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            video.play();
            resolve(net);
        };
    });
}