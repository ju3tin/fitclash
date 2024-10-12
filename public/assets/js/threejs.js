async function main() {
    const net = await setupPoseNet();
    const { scene, camera, renderer, cube } = setupThreeJS();

    async function detectPose() {
        const pose = await net.estimateSinglePose(video, {
            flipHorizontal: false
        });

        // Example: Control the cube's rotation using the wrist position
        const rightWrist = pose.keypoints.find(k => k.part === 'rightWrist');
        const leftWrist = pose.keypoints.find(k => k.part === 'leftWrist');

        if (rightWrist.score > 0.5) {
            cube.rotation.x = (rightWrist.position.y / window.innerHeight) * Math.PI * 2;
            cube.rotation.y = (rightWrist.position.x / window.innerWidth) * Math.PI * 2;
        }

        requestAnimationFrame(detectPose);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    detectPose();
    animate();
}

main();