import React, { useState, useRef } from 'react';
import { Upload, Crop, RotateCw, ZoomIn, ZoomOut, Download, X } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface ImageCropInputProps {
  value?: string; // Base64 or URL
  onChange?: (croppedImage: string) => void;
  aspectRatio?: number; // width/height (e.g., 16/9, 1, 4/3)
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function ImageCropInput({
  value,
  onChange,
  aspectRatio = 1,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.9,
  disabled = false,
  className = '',
  label,
}: ImageCropInputProps) {
  const [image, setImage] = useState<string | null>(value || null);
  const [cropping, setCropping] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate dimensions
    const scale = Math.max(
      maxWidth / img.naturalWidth,
      maxHeight / img.naturalHeight
    );

    const scaledWidth = img.naturalWidth * scale * zoom;
    const scaledHeight = img.naturalHeight * scale * zoom;

    // Set canvas size based on aspect ratio
    let canvasWidth = maxWidth;
    let canvasHeight = maxWidth / aspectRatio;

    if (canvasHeight > maxHeight) {
      canvasHeight = maxHeight;
      canvasWidth = maxHeight * aspectRatio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Apply rotation
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

    // Draw image centered
    const x = (canvasWidth - scaledWidth) / 2;
    const y = (canvasHeight - scaledHeight) / 2;
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

    ctx.restore();

    // Export as base64
    const croppedImage = canvas.toDataURL('image/jpeg', quality);
    onChange?.(croppedImage);
    setImage(croppedImage);
    setCropping(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.download = 'cropped-image.jpg';
    link.href = image;
    link.click();
  };

  const handleClear = () => {
    setImage(null);
    setCropping(false);
    setZoom(1);
    setRotation(0);
    onChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="space-y-4">
        {/* Upload Area */}
        {!image && (
          <div
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
              transition-all
              ${disabled
                ? 'border-border dark:border-border opacity-50 cursor-not-allowed'
                : 'border-border dark:border-border hover:border-indigo-400 dark:hover:border-indigo-600'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-950/30">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Click to upload image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF • Max {maxWidth}x{maxHeight}px
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Crop Editor */}
        {image && cropping && (
          <div className="border-2 border-border dark:border-border rounded-xl overflow-hidden bg-card dark:bg-card">
            {/* Preview */}
            <div className="relative bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center min-h-[300px]">
              <img
                ref={imageRef}
                src={image}
                alt="Crop preview"
                className="max-w-full max-h-[400px] object-contain"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s',
                }}
              />

              {/* Hidden canvas for cropping */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-border dark:border-border space-y-4">
              {/* Zoom Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Zoom</span>
                  <span className="text-sm text-muted-foreground">{(zoom * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
                  >
                    <ZoomOut className="w-4 h-4 text-foreground" />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1"
                  />
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                  className="flex items-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Rotate
                </Button>

                <div className="ml-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCropping(false);
                      setZoom(1);
                      setRotation(0);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCrop}
                    className="flex items-center gap-2"
                  >
                    <Crop className="w-4 h-4" />
                    Apply Crop
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {image && !cropping && (
          <div className="border-2 border-border dark:border-border rounded-xl overflow-hidden bg-card dark:bg-card">
            <div className="p-4 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <img
                src={image}
                alt="Cropped preview"
                className="max-w-full max-h-[400px] object-contain rounded-lg"
              />
            </div>

            <div className="p-4 border-t border-border dark:border-border flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCropping(true);
                  setZoom(1);
                  setRotation(0);
                }}
                className="flex items-center gap-2"
              >
                <Crop className="w-4 h-4" />
                Re-crop
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex items-center gap-2 ml-auto"
              >
                <X className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
