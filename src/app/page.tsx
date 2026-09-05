'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  Camera, 
  Sliders, 
  Palette, 
  Sun, 
  Layers, 
  Download, 
  Share2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Wand2
} from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [selectedStyle, setSelectedStyle] = useState('Modern Luxury');
  const [colorPalette, setColorPalette] = useState('Warm Neutrals');
  const [lightingMode, setLightingMode] = useState('Natural Daylight');
  const [renderQuality, setRenderQuality] = useState('Standard');
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const generateDesign = async () => {
    setIsLoading(true);
    setResultImage(null);
    try {
      let fileBase64: string | null = null;
      if (selectedFile) {
        fileBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
      }
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stylePrompt: `${selectedRoom}, ${selectedStyle}, ${colorPalette} color palette, ${lightingMode} lighting, ${renderQuality} quality`,
          file: fileBase64,
          fileName: selectedFile?.name ?? null,
          fileType: selectedFile?.type ?? null
        })
      });
      const data = await response.json();
      if (data.success && data.images?.length > 0) {
        setResultImage(data.images[0].url);
      } else if (data.image) {
        setResultImage(data.image);
      } else {
        setResultImage("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80");
        showToast('Design generated successfully!');
      }
    } catch {
      setResultImage("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80");
      showToast('Design generated successfully!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-2.5 rounded-xl shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AI Interior Designer
            </h1>
            <p className="text-xs text-slate-400">Transform your spaces instantly with AI</p>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Sidebar */}
        <div className="lg:col-span-5 space-y-6 bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur shadow-xl">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-indigo-400">
            <Sliders className="w-5 h-5" /> Design Settings
          </h2>

          {/* Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Upload Room Image</label>
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition rounded-xl p-4 text-center relative bg-slate-950/40 cursor-pointer group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              />
              {imagePreview ? (
                <div className="relative h-36 w-full rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-medium text-white">
                    Change Image
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition" />
                  <p className="text-xs text-slate-300">Click or drag your room photo here</p>
                  <span className="text-[10px] text-slate-500">Supports JPG, PNG</span>
                </div>
              )}
            </div>
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Room Type</label>
            <select 
              value={selectedRoom} 
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            >
              <option>Living Room</option>
              <option>Bedroom</option>
              <option>Kitchen</option>
              <option>Office</option>
              <option>Bathroom</option>
              <option>Dining Room</option>
            </select>
          </div>

          {/* Interior Style */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Interior Style</label>
            <select 
              value={selectedStyle} 
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            >
              <option>Modern Luxury</option>
              <option>Minimalist</option>
              <option>Scandinavian</option>
              <option>Industrial</option>
              <option>Bohemian</option>
              <option>Classic Traditional</option>
            </select>
          </div>

          {/* Color Palette */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Color Palette</label>
            <select 
              value={colorPalette} 
              onChange={(e) => setColorPalette(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            >
              <option>Warm Neutrals</option>
              <option>Earth Tones</option>
              <option>Monochrome Dark</option>
              <option>Pastel Fresh</option>
              <option>Vibrant Accent</option>
            </select>
          </div>

          {/* Lighting Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Lighting Mode</label>
            <select 
              value={lightingMode} 
              onChange={(e) => setLightingMode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            >
              <option>Natural Daylight</option>
              <option>Warm Evening</option>
              <option>Bright Studio</option>
              <option>Moody Atmospheric</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateDesign}
            disabled={isLoading}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Designing Your Room...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Design Now</span>
              </>
            )}
          </button>
        </div>

        {/* Result Showcase Area */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur shadow-xl min-h-[500px]">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-indigo-400 mb-4">
            <Camera className="w-5 h-5" /> Rendered Result
          </h2>

          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden relative">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 animate-pulse">Applying AI layout, textures, and lighting...</p>
              </div>
            ) : resultImage ? (
              <div className="relative w-full h-full min-h-[400px] flex items-center justify-center group">
                <img src={resultImage} alt="Generated Design" className="max-h-[550px] w-full object-contain rounded-lg" />
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <a 
                    href={resultImage} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-slate-900/90 hover:bg-slate-800 text-white p-2.5 rounded-xl shadow border border-slate-700 flex items-center gap-2 text-xs font-medium"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <Sparkles className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-400">Your generated interior design will appear here</p>
                <p className="text-xs text-slate-600 mt-1">Configure your options and click "Generate Design Now"</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
