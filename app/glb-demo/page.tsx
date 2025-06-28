"use client"

import GLBLoader from "../../components/GLBLoader";
import { useState } from "react";

export default function GLBDemoPage() {
  const [modelPath, setModelPath] = useState("/models/Xbot.glb");
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(400);
  const [backgroundColor, setBackgroundColor] = useState("#e5e7eb");
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          GLB File Loader Demo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Path
                </label>
                <input
                  type="text"
                  value={modelPath}
                  onChange={(e) => setModelPath(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/models/your-model.glb"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Place your GLB file in the public/models/ directory
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="200"
                    max="800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="200"
                    max="600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoRotate"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoRotate" className="ml-2 block text-sm text-gray-900">
                  Auto Rotate
                </label>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Place your GLB file in the public/models/ directory</li>
                <li>• Update the model path above</li>
                <li>• Use mouse to rotate, scroll to zoom</li>
                <li>• Right-click and drag to pan</li>
              </ul>
            </div>
          </div>

          {/* 3D Viewer */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">3D Model Viewer</h2>
            <div className="flex justify-center">
              <GLBLoader
                modelPath={modelPath}
                width={width}
                height={height}
                backgroundColor={backgroundColor}
                autoRotate={autoRotate}
              />
            </div>
          </div>
        </div>

        {/* Example Models */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Example Models</h2>
          <p className="text-gray-600 mb-4">
            If you don't have a GLB file, you can download free models from:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount&type=models"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-blue-600">Sketchfab</h3>
              <p className="text-sm text-gray-600">Free 3D models with CC licenses</p>
            </a>
            <a
              href="https://www.turbosquid.com/Search/3D-Models/free"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-blue-600">TurboSquid</h3>
              <p className="text-sm text-gray-600">Free and paid 3D models</p>
            </a>
            <a
              href="https://free3d.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-blue-600">Free3D</h3>
              <p className="text-sm text-gray-600">Free 3D models and resources</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 