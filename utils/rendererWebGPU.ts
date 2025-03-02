import { Tensor } from '@tensorflow/tfjs-core';
import { getDevice, byteSizeFromShape } from './rendererUtils';

export class RendererWebGPU {
    device: GPUDevice;
    swapChain: GPUCanvasContext;
    indexBuffer: GPUBuffer | null;
    uniformBuffer: GPUBuffer | null;
    posePipeline: GPURenderPipeline | null;
    poseIndexCount: number;
    texturePipeline: GPURenderPipeline | null;
    canvasInfo: Float32Array | any;
    importVideo: boolean;
    scoreThreshold: number;
    pipelineCache: { [key: number]: GPURenderPipeline };
    drawImageContext: CanvasRenderingContext2D | null;

    constructor(canvas: HTMLCanvasElement, importVideo: boolean) {
        const { device, context } = getDevice<GPUCanvasContext>(canvas);
        this.device = device;
        this.swapChain = context;
        this.indexBuffer = null;
        this.uniformBuffer = null;
        this.posePipeline = null;
        this.poseIndexCount = 0;
        this.texturePipeline = null;
        this.canvasInfo = null;
        this.importVideo = importVideo;
        this.scoreThreshold = 0;
        this.pipelineCache = {};
        if (importVideo === false) {
            this.drawImageContext = document.createElement('canvas').getContext('2d');
        } else {
            this.drawImageContext = null;
        }
    }

    createBuffer(usage: number, size: number, array: Float32Array | Uint32Array | null = null) {
        const mappedAtCreation = array ? true : false;
        const buffer = this.device.createBuffer({ size, usage, mappedAtCreation });
        if (array instanceof Float32Array) {
            new Float32Array(buffer.getMappedRange()).set(array);
            buffer.unmap();
        } else if (array instanceof Uint32Array) {
            new Uint32Array(buffer.getMappedRange()).set(array);
            buffer.unmap();
        }

        return buffer;
    }

    draw(rendererParams: [HTMLVideoElement, Tensor[], Float32Array, number]) {
        const [video, tensors, canvasInfo, scoreThreshold] = rendererParams;
        this.canvasInfo = canvasInfo;
        this.scoreThreshold = scoreThreshold;
        const videoCommandBuffer = this.drawTexture(video);
        const poseCommandBuffer = this.drawPose(tensors[0], tensors[1]);
        this.device.queue.submit([videoCommandBuffer, poseCommandBuffer]);
    }

    getPoseShader() {
        const vertexShaderCode: string = `
            struct Uniforms {
                offsetX : f32,
                offsetY : f32,
                scaleX : f32,
                scaleY : f32,
                width : f32,
                height : f32,
            }

            struct VertexOutput {
                @builtin(position) pos: vec4<f32>,
                @location(0) score: f32,
            };

            @binding(0) @group(0) var<uniform> uniforms : Uniforms;
            @binding(1) @group(0) var<storage> keypoints : array<vec2<f32>>;
            @binding(2) @group(0) var<storage> scores : array<f32>;
            @vertex
            fn main(
                @builtin(vertex_index) VertexIndex : u32
            ) -> VertexOutput {
                var<function> vertexOutput: VertexOutput;
                let rawY = (keypoints[VertexIndex].x + uniforms.offsetY) * uniforms.scaleY / uniforms.height;
                let rawX = (keypoints[VertexIndex].y + uniforms.offsetX) * uniforms.scaleX / uniforms.width;
                // Flip horizontally.
                var x = 1.0 - rawX * 2.0;
                var y = 1.0 - rawY * 2.0;
                vertexOutput.score = scores[VertexIndex];
                vertexOutput.pos = vec4<f32>(x, y, 1.0, 1.0);
                return vertexOutput;
            }
        `;
        const fragmentShaderCode: string = `
            @fragment
            fn main(@location(0) score: f32) -> @location(0) vec4<f32> {
                if (score < ${this.scoreThreshold}) {
                    discard;
                }
                return vec4<f32>(1.0, 0.0, 0.0, 1.0);
            }
        `;

        return [vertexShaderCode, fragmentShaderCode];
    }

    initDrawPose(keypointsTensor: Tensor, scoresTensor: Tensor) {
        if (keypointsTensor == null || keypointsTensor.shape.length !== 2 || keypointsTensor.shape[1] !== 2) {
            throw new Error('Tensor is null or tensor shape is not supported!');
        }

        const poseIndexArray = new Uint32Array([
            4, 2, 2, 0, 0, 1, 1, 3, 10, 8, 8, 6, 6, 5, 5, 7, 7, 9, 6, 12, 12, 14, 14, 16, 12, 11, 5, 11, 11, 13, 13, 15,
        ]);
        this.poseIndexCount = poseIndexArray.length;

        if (this.indexBuffer == null) {
            this.indexBuffer = this.createBuffer(GPUBufferUsage.INDEX, poseIndexArray.byteLength, poseIndexArray);
        }
        if (this.uniformBuffer == null) {
            this.uniformBuffer = this.createBuffer(
                GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                this.canvasInfo.length * 4,
            );
        }

        if (this.scoreThreshold in this.pipelineCache) {
            this.posePipeline = this.pipelineCache[this.scoreThreshold];
        } else {
            this.posePipeline = this.createPosePipeline();
            this.pipelineCache[this.scoreThreshold] = this.posePipeline;
        }

        const keypointsBuffer = keypointsTensor.dataToGPU()?.buffer;
        const scoresBuffer = scoresTensor.dataToGPU()?.buffer;

        if (!keypointsBuffer || !scoresBuffer) {
            throw new Error('Failed to get GPU buffer from tensors.');
        }

        const bindings = [
            {
                buffer: this.uniformBuffer,
                offset: 0,
                size: this.canvasInfo.length * 4,
            },
            {
                buffer: keypointsBuffer,
                offset: 0,
                size: byteSizeFromShape(keypointsTensor.shape),
            },
            {
                buffer: scoresBuffer,
                offset: 0,
                size: byteSizeFromShape(scoresTensor.shape),
            },
        ];

        return this.device.createBindGroup({
            layout: this.posePipeline.getBindGroupLayout(0),
            entries: bindings.map((b, i) => ({ binding: i, resource: b })),
        });
    }

    drawPose(keypointsTensor: Tensor, scoresTensor: Tensor) {
        const poseBindGroup = this.initDrawPose(keypointsTensor, scoresTensor);
        const textureView = this.swapChain.getCurrentTexture().createView();
        const uniformData = new Float32Array(this.canvasInfo);

        if (this.uniformBuffer === null) {
            throw new Error('uniformBuffer is null');
        }

        this.device.queue.writeBuffer(
            this.uniformBuffer,
            0,
            uniformData.buffer,
            uniformData.byteOffset,
            uniformData.byteLength,
        );

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
                    loadOp: 'load' as GPULoadOp,
                    storeOp: 'store' as GPUStoreOp,
                },
            ],
        };
        const commandEncoder = this.device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        if (this.posePipeline === null) {
            throw new Error('posePipeline is null');
        }
        passEncoder.setPipeline(this.posePipeline);

        if (this.indexBuffer === null) {
            throw new Error('indexBuffer is null');
        }
        passEncoder.setIndexBuffer(this.indexBuffer, 'uint32');
        passEncoder.setBindGroup(0, poseBindGroup);
        passEncoder.drawIndexed(this.poseIndexCount);
        passEncoder.end();

        return commandEncoder.finish();
    }

    createPosePipeline() {
        const [vertexShaderCode, fragmentShaderCode] = this.getPoseShader();
        return this.device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: this.device.createShaderModule({ code: vertexShaderCode }),
                entryPoint: 'main',
            },
            fragment: {
                module: this.device.createShaderModule({ code: fragmentShaderCode }),
                entryPoint: 'main',
                targets: [
                    {
                        format: navigator.gpu.getPreferredCanvasFormat(),
                        blend: {
                            color: {
                                srcFactor: 'src-alpha',
                                dstFactor: 'one-minus-src-alpha',
                                operation: 'add',
                            },
                            alpha: {
                                srcFactor: 'one',
                                dstFactor: 'one-minus-src-alpha',
                                operation: 'add',
                            },
                        },
                    },
                ] as GPUColorTargetState[],
            },
            primitive: {
                topology: 'line-list',
            },
        });
    }

    getExternalTextureShader() {
        const vertexShaderCode = `
            @vertex fn main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {
                var pos = array<vec4<f32>, 6>(
                    vec4<f32>( 1.0, 1.0, 0.0, 1.0),
                    vec4<f32>( 1.0, -1.0, 0.0, 1.0),
                    vec4<f32>(-1.0, -1.0, 0.0, 1.0),
                    vec4<f32>( 1.0, 1.0, 0.0, 1.0),
                    vec4<f32>(-1.0, -1.0, 0.0, 1.0),
                    vec4<f32>(-1.0, 1.0, 0.0, 1.0)
                );
                return pos[VertexIndex];
            }
        `;
        const textureType = this.importVideo ? 'texture_external' : 'texture_2d<f32>';
        const fragmentShaderCode = `
            @group(0) @binding(0) var s : sampler;
            @group(0) @binding(1) var t : ${textureType};

            @fragment fn main(@builtin(position) FragCoord : vec4<f32>)
                                    -> @location(0) vec4<f32> {
                var coord = FragCoord.xy / vec2<f32>(${this.canvasInfo[4]}, ${this.canvasInfo[5]});
                // Flip horizontally.
                coord.x = 1.0 - coord.x;
                return textureSampleBaseClampToEdge(t, s, coord);
            }
        `;

        return [vertexShaderCode, fragmentShaderCode];
    }

    drawTexture(video: HTMLVideoElement) {
        const textureBindGroup = this.initDrawTexture(video);
        const commandEncoder = this.device.createCommandEncoder();
        const textureView = this.swapChain.getCurrentTexture().createView();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
                    loadOp: 'clear' as GPULoadOp,
                    storeOp: 'store' as GPUStoreOp
                },
            ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

        if (this.texturePipeline === null) {
            throw new Error('texturePipeline is null');
        }
        passEncoder.setPipeline(this.texturePipeline);
        passEncoder.setBindGroup(0, textureBindGroup);
        passEncoder.draw(6);
        passEncoder.end();

        return commandEncoder.finish();
    }

    createTexturePipeline() {
        const [vertexShaderCode, fragmentShaderCode] = this.getExternalTextureShader();
        this.texturePipeline = this.device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: this.device.createShaderModule({
                    code: vertexShaderCode,
                }),
                entryPoint: 'main',
            },
            fragment: {
                module: this.device.createShaderModule({
                    code: fragmentShaderCode,
                }),
                entryPoint: 'main',
                targets: [
                    {
                        format: 'bgra8unorm' as GPUTextureFormat,
                    },
                ],
            },
            primitive: { topology: 'triangle-list' },
        });
    }

    initDrawTexture(video: HTMLVideoElement) {
        if (this.texturePipeline === null) {
            this.createTexturePipeline();
        }

        const linearSampler = this.device.createSampler();
        let externalTexture: GPUExternalTexture | undefined;
        let texture: GPUTexture | undefined;

        if (this.importVideo) {
            externalTexture = this.device.importExternalTexture({
                source: video,
            });
        } else {
            const width = this.canvasInfo[4];
            const height = this.canvasInfo[5];

            this.drawImageContext!.canvas.width = width;
            this.drawImageContext!.canvas.height = height;
            this.drawImageContext!.drawImage(video, 0, 0, width, height);

            const pixels = this.drawImageContext!.canvas;
            const format = 'rgba8unorm';
            const usage = GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING;
            texture = this.device.createTexture({
                size: [width, height],
                format,
                usage,
            });
            this.device.queue.copyExternalImageToTexture({ source: pixels }, { texture: texture }, [
                width,
                height,
            ]);
        }

        const bindGroupEntries: GPUBindGroupEntry[] = [
            {
                binding: 0,
                resource: linearSampler,
            },
            {
                binding: 1,
                resource: this.importVideo ? externalTexture! : texture!.createView(),
            },
        ];

        if (this.texturePipeline === null) {
            throw new Error('texturePipeline is null');
        }
        const bindGroup = this.device.createBindGroup({
            layout: this.texturePipeline.getBindGroupLayout(0),
            entries: bindGroupEntries,
        });

        return bindGroup;
    }

    dispose() {
        this.indexBuffer?.destroy();
        this.uniformBuffer?.destroy();
    }
}
