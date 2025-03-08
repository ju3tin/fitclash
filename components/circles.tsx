"use client"
import { useEffect, useRef, useState } from "react";

export default function BoxingGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight });

            const handleResize = () => {
                setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
            };

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];
        const fixedRadius = 30; // Fixed circle size
        let speed = 2;
        const spacing = fixedRadius * 2; // Minimum space between circles

        let leftCircles: { x: number; y: number; color: string; speed: number }[] = [];
        let rightCircles: { x: number; y: number; color: string; speed: number }[] = [];

        const leftColumnX = canvasSize.width * 0.25;
        const rightColumnX = canvasSize.width * 0.75;

        // Static target positions behind the columns
        const leftTargetY = canvasSize.height / 2 - 100;
        const rightTargetY = canvasSize.height / 2 - 100;

        const createCircle = (column: "left" | "right") => {
            const x = column === "left" ? leftColumnX : rightColumnX;
            const y = column === "left"
                ? leftCircles.length * spacing
                : rightCircles.length * spacing;

            // Only create a circle if there's space in the column
            if (y + fixedRadius < canvasSize.height) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                return { x, y, color, speed };
            }
            return null;
        };

        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

            // Draw targets behind the circles (these targets are static)
            ctx.beginPath();
            ctx.arc(leftColumnX, leftTargetY, fixedRadius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "gray"; // Static target color
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(rightColumnX, rightTargetY, fixedRadius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "gray"; // Static target color
            ctx.fill();
            ctx.closePath();

            // Move and filter out circles that have gone off-screen
            leftCircles = leftCircles.map(c => ({ ...c, y: c.y - c.speed })).filter(c => c.y + fixedRadius > 0);
            rightCircles = rightCircles.map(c => ({ ...c, y: c.y - c.speed })).filter(c => c.y + fixedRadius > 0);

            // Draw left column circles
            leftCircles.forEach(circle => {
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, fixedRadius, 0, Math.PI * 2);
                ctx.fillStyle = circle.color;
                ctx.fill();
                ctx.closePath();
            });

            // Draw right column circles
            rightCircles.forEach(circle => {
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, fixedRadius, 0, Math.PI * 2);
                ctx.fillStyle = circle.color;
                ctx.fill();
                ctx.closePath();
            });

            // Add new circles to the left column
            const newLeftCircle = createCircle("left");
            if (newLeftCircle) leftCircles.push(newLeftCircle);

            // Add new circles to the right column
            const newRightCircle = createCircle("right");
            if (newRightCircle) rightCircles.push(newRightCircle);

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        const speedInterval = setInterval(() => {
            speed += 0.5;
        }, 5000);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(speedInterval);
        };
    }, [canvasSize]);

    return (
        <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ border: "1px solid black", display: "block", background: "#000000" }}
        />
    );
}