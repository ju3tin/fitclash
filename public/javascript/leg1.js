// Our input frames will come from here.
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];
const canvasCtx = canvasElement.getContext('2d');

// const counterElement = document.getElementsByClassName('counter_canvas')[0];
// const canvasCounter = counterElement.getContext('2d');

// We'll add this to our control panel later, but we'll save it here so we can
// call tick() each time the graph runs.
const fpsControl = new FPS();

// Optimization: Turn off animated spinner after its hiding animation is done.
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
    spinner.style.display = 'none';
};

// Push-up counter stuff
let nose_y = 0.5;   // nose_y = height(720) / 2
let stage = "UP";
let counter = 0;

function zColor(data) {
    return 'white';
}



function onResults(results) {
    // Hide the spinner.
    document.body.classList.add('loaded');

    // Update the frame rate.
    fpsControl.tick();

    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    drawConnectors(
        canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
            visibilityMin: 0.65,
            color: 'white'
        });
    drawLandmarks(
        canvasCtx,
        Object.values(POSE_LANDMARKS_LEFT)
        .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: zColor, fillColor: 'rgb(255,138,0)' });
    drawLandmarks(
        canvasCtx,
        Object.values(POSE_LANDMARKS_RIGHT)
        .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: zColor, fillColor: 'rgb(0,217,231)' });
    drawLandmarks(
        canvasCtx,
        Object.values(POSE_LANDMARKS_NEUTRAL)
        .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: zColor, fillColor: 'white' });

    const nose = Object.values(POSE_LANDMARKS_NEUTRAL)
        .map(index => results.poseLandmarks[index]);
    nose_y = nose[0].y;
    console.log(nose_y);

    if (nose_y <= 0.5) {
        stage = "UP";
    } 
    if (nose_y > 0.7 && stage == "UP") {
        stage = "DOWN";
        counter += 1;
    }
    

    canvasCtx.font = "30px Arial";
    canvasCtx.fillStyle = "red";
    canvasCtx.fillText(stage + ": " + counter.toString(), 1100, 50);
    canvasCtx.restore();
}

const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.3.1621277220/${file}`;
    }
});
pose.onResults(onResults);

/**
 * Instantiate a camera. We'll feed each frame we receive into the solution.
 */
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});
camera.start();

// Present a control panel through which the user can manipulate the solution
// options.
new ControlPanel(controlsElement, {
        selfieMode: true,
        modelComplexity: 0,
        smoothLandmarks: true,
        minDetectionConfidence: 0.2,
        minTrackingConfidence: 0.2
    })
    .add([
        new StaticText({ title: 'Pushup Counter Mode' }),
        fpsControl
        // new Toggle({ title: 'Right Hand Practice', field: 'selfieMode' }),
        // new Slider({
        //     title: 'Model Complexity',
        //     field: 'modelComplexity',
        //     discrete: ['Lite', 'Full', 'Heavy'],
        // }),
        // new Toggle({ title: 'Smooth Landmarks', field: 'smoothLandmarks' }),
        // new Slider({
        //     title: 'Min Detection Confidence',
        //     field: 'minDetectionConfidence',
        //     range: [0, 1],
        //     step: 0.01
        // }),
        // new Slider({
        //     title: 'Min Tracking Confidence',
        //     field: 'minTrackingConfidence',
        //     range: [0, 1],
        //     step: 0.01
        // }),
    ])
    .on(options => {
        videoElement.classList.toggle('selfie', options.selfieMode);
        pose.setOptions(options);
    });