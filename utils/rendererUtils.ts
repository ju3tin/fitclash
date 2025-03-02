import { WebGPUBackend } from '@tensorflow/tfjs-backend-webgpu';
import * as tf from '@tensorflow/tfjs-core';

export type BackendType = 'webgl' | 'webgpu';
export type DeviceType<T> = T extends GPUCanvasContext ? GPUDevice : null;
export interface Device<T> {
    device: DeviceType<T>;
    context: T;
}

export function getDevice<T extends WebGLRenderingContext | GPUCanvasContext>(canvas: HTMLCanvasElement): Device<T> {
    const backend = tf.getBackend();

    if (backend === 'webgpu') {
        const device = (tf.backend() as WebGPUBackend).device as GPUDevice;
        const context = canvas.getContext('webgpu') as T;
        if (!context || !device) {
            throw new Error('Failed to initialize WebGPU context or device.');
        }
        (context as GPUCanvasContext).configure({
            device,
            format: navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: 'opaque',
        });
        return { device: device as DeviceType<T>, context };
    } else if (backend === 'webgl') {
        const context = canvas.getContext('webgl') as T;
        if (!context) {
            throw new Error('Failed to initialize WebGL context.');
        }
        return { device: null as DeviceType<T>, context };
    } else {
        throw new Error('This function only supports WebGL and WebGPU backends!');
    }
}

export function byteSizeFromShape(shape: number[]): number {
    if (shape.length === 0) {
        return 4; // Scalar.
    }
    let size = shape[0];
    for (let i = 1; i < shape.length; i++) {
        size *= shape[i];
    }

    return size * 4;
}
