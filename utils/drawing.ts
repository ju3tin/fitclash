import type * as posedetection from "@tensorflow-models/pose-detection"

// Define the keypoint pairs that should be connected with lines
export const POSE_CONNECTIONS = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4], // Face
  [5, 6],
  [5, 7],
  [7, 9],
  [6, 8],
  [8, 10], // Arms
  [5, 11],
  [6, 12],
  [11, 12], // Torso
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16], // Legs
]

// Color mapping for different body parts
export const COLOR_PALETTE = {
  left: "rgb(255, 138, 0)",
  right: "rgb(41, 152, 255)",
  middle: "rgb(234, 90, 186)",
}

// Get color based on keypoint id
export function getKeypointColor(id: number): string {
  if ([0, 1, 2, 3, 4].includes(id)) return COLOR_PALETTE.middle // Face
  if ([5, 7, 9, 11, 13, 15].includes(id)) return COLOR_PALETTE.left // Left side
  return COLOR_PALETTE.right // Right side
}

// Draw a keypoint on the canvas
export function drawKeypoint(ctx: CanvasRenderingContext2D, keypoint: posedetection.Keypoint, size = 4) {
  if (keypoint.score && keypoint.score > 0.3) {
    const { x, y } = keypoint
    ctx.beginPath()
    ctx.arc(x, y, size, 0, 2 * Math.PI)
    ctx.fillStyle = getKeypointColor(keypoint.id || 0)
    ctx.fill()
  }
}

// Draw a line between two keypoints
export function drawSegment(
  ctx: CanvasRenderingContext2D,
  [kp1, kp2]: [posedetection.Keypoint, posedetection.Keypoint],
  color: string,
  lineWidth = 2,
) {
  if (kp1.score && kp2.score && kp1.score > 0.3 && kp2.score > 0.3) {
    ctx.beginPath()
    ctx.moveTo(kp1.x, kp1.y)
    ctx.lineTo(kp2.x, kp2.y)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.stroke()
  }
}

// Draw the skeleton by connecting keypoints
export function drawSkeleton(ctx: CanvasRenderingContext2D, keypoints: posedetection.Keypoint[], lineWidth = 2) {
  POSE_CONNECTIONS.forEach(([i, j]) => {
    const kp1 = keypoints[i]
    const kp2 = keypoints[j]

    if (kp1 && kp2) {
      // Determine color based on the connection
      const color = getKeypointColor(i)
      drawSegment(ctx, [kp1, kp2], color, lineWidth)
    }
  })
}

// Draw the pose (keypoints and skeleton)
export function drawPose(ctx: CanvasRenderingContext2D, pose: posedetection.Pose, keypointSize = 4, lineWidth = 2) {
  if (pose.keypoints) {
    // Draw keypoints
    pose.keypoints.forEach((keypoint) => {
      drawKeypoint(ctx, keypoint, keypointSize)
    })

    // Draw skeleton
    drawSkeleton(ctx, pose.keypoints, lineWidth)
  }
}
