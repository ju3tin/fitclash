async function main() {
    const { net, video, canvas, ctx } = await setupPoseNet();
    const { scene, camera, renderer, cube } = setupThreeJS();

    async function detectPose() {
        const pose = await net.estimateSinglePose(video, {
            flipHorizontal: false
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        drawKeypoints(pose.keypoints, ctx);
        drawSkeleton(pose.keypoints, ctx);

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