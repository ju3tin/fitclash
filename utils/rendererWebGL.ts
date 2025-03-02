import * as poseDetection from '@tensorflow-models/pose-detection';

export class RendererWebGL {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    videoProgram: WebGLProgram | null = null;
    keypointProgram: WebGLProgram | null = null;
    positionBuffer: WebGLBuffer | null = null;
    texture: WebGLTexture | null = null;

    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
        this.canvas = canvas;
        this.gl = gl;
        this.initialize();
    }

    private initialize() {
        const gl = this.gl;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Setup for drawing video
        this.videoProgram = this.createProgram(videoVertexShaderSource, videoFragmentShaderSource);
        // Setup for drawing keypoints
        this.keypointProgram = this.createProgram(keypointVertexShaderSource, keypointFragmentShaderSource);
        gl.useProgram(this.videoProgram);

        // Create buffer for positions
        this.positionBuffer = gl.createBuffer();

        // Create texture for video frames
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    public draw(video: HTMLVideoElement, poses: poseDetection.Pose[]): void {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Update and draw video frame using WebGL
        this.updateTexture(video);

        // Draw video texture
        this.drawVideo();

        // Draw keypoints on WebGL
        poses.forEach((pose) => {
            const filteredKeypoints = pose.keypoints.filter(keypoint => keypoint.score !== undefined && keypoint.score > 0.25);
            const points = filteredKeypoints.map(keypoint => [
                keypoint.x / this.canvas.width * 2 - 1,
                keypoint.y / this.canvas.height * -2 + 1
            ]).flat();

            if (points.length > 0) {
                this.drawPoints(points);
                this.drawSkeleton(filteredKeypoints);
            }
        });
    }

    private createShader(type: GLenum, source: string): WebGLShader {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error('Shader creation failed');
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success || !shader) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            throw new Error('Shader compilation failed');
        }

        return shader;
    }

    private createProgram(vertexSource: string, fragmentSource: string): WebGLProgram {
        const gl = this.gl;
        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource);
        const program = gl.createProgram();
        if (!program) {
            throw new Error('Program creation failed');
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success || !program) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            throw new Error('Program linking failed');
        }

        return program;
    }

    private updateTexture(video: HTMLVideoElement) {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    }

    private drawVideo() {
        if (!this.videoProgram) {
            return;
        }
        const gl = this.gl;
        gl.useProgram(this.videoProgram);
        const vertices = new Float32Array([
            -1, -1,
            1, -1,
            -1,  1,
            1,  1,
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(this.videoProgram, 'a_position');
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        const textureLocation = gl.getUniformLocation(this.videoProgram, 'u_texture');
        gl.uniform1i(textureLocation, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    private drawPoints(points: number[]): void {
        if (!this.keypointProgram) {
            return;
        }
        const gl = this.gl;
        gl.useProgram(this.keypointProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(this.keypointProgram, 'a_position');
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);
        gl.drawArrays(gl.POINTS, 0, points.length / 2);
    }

    private drawSkeleton(keypoints: poseDetection.Keypoint[]): void {
        if (!this.keypointProgram) {
            return;
        }
        const adjacentPairs = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);

        for (const [i, j] of adjacentPairs) {
            const keypoint1 = keypoints[i];
            const keypoint2 = keypoints[j];
            if (typeof keypoint1?.score === 'undefined' || typeof keypoint2?.score === 'undefined') {
                continue;
            }

            if (keypoint1.score >= 0.25 && keypoint2.score >= 0.25) {
                const positions = [
                    keypoint1.x / this.canvas.width * 2 - 1,
                    keypoint1.y / this.canvas.height * -2 + 1,
                    keypoint2.x / this.canvas.width * 2 - 1,
                    keypoint2.y / this.canvas.height * -2 + 1
                ];

                this.drawLine(positions);
            }
        }
    }

    private drawLine(positions: number[]): void {
        if (!this.keypointProgram) {
            return;
        }
        const gl = this.gl;
        gl.useProgram(this.keypointProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(this.keypointProgram, 'a_position');
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);
        gl.drawArrays(gl.LINES, 0, positions.length / 2);
    }
}

// Vertex shader source for video
const videoVertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main() {
        v_texCoord = vec2((a_position.x * -0.5) + 0.5, (a_position.y * -0.5) + 0.5);
        gl_Position = vec4(a_position, 0, 1);
    }
`;

// Fragment shader source for video
const videoFragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`;

// Vertex shader source for keypoints
const keypointVertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(vec2(a_position.x * -1.0, a_position.y), 0, 1);
        gl_PointSize = 5.0;
    }
`;

// Fragment shader source for keypoints
const keypointFragmentShaderSource = `
    void main() {
        gl_FragColor = vec4(1, 0, 0, 1);
    }
`;
