async function setupPoseNet() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const net = await posenet.load();

    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            video.play();
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            resolve({ net, video, canvas, ctx });
        };
    });
}

function drawKeypoints(keypoints, ctx) {
    keypoints.forEach(keypoint => {
        if (keypoint.score > 0.5) {
            const { y, x } = keypoint.position;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
        }
    });
}

function drawSkeleton(keypoints, ctx) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, 0.5);
    
    adjacentKeyPoints.forEach((keypoints) => {
        const [firstPoint, secondPoint] = keypoints;

        ctx.beginPath();
        ctx.moveTo(firstPoint.position.x, firstPoint.position.y);
        ctx.lineTo(secondPoint.position.x, secondPoint.position.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.stroke();
    });
}