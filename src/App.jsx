import React, { useState, useRef } from 'react';
import { Upload, X, Download } from 'lucide-react';

const App = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [splittedSections, setSplittedSections] = useState([]);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setUploadedImage(img);
          splitImage(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const splitImage = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the original image
    ctx.drawImage(img, 0, 0);
    
    const sections = [];
    const leftWidth = Math.floor(img.width / 2);
    const rightWidth = img.width - leftWidth;
    
    // Left sections (1:1 ratio)
    const leftHeight = Math.floor(img.height / 2);
    
    // Right sections (3:2 ratio)
    const rightSectionHeight = Math.floor(img.height / 3);
    
    // Create sections
    sections.push(ctx.getImageData(0, 0, leftWidth, leftHeight)); // Section 1
    sections.push(ctx.getImageData(0, leftHeight, leftWidth, leftHeight)); // Section 2
    sections.push(ctx.getImageData(leftWidth, 0, rightWidth, rightSectionHeight)); // Section 3
    sections.push(ctx.getImageData(leftWidth, rightSectionHeight, rightWidth, rightSectionHeight)); // Section 4
    sections.push(ctx.getImageData(leftWidth, rightSectionHeight * 2, rightWidth, rightSectionHeight)); // Section 5
    
    setSplittedSections(sections);
  };

  const downloadSection = (imageData, index) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    
    const link = document.createElement('a');
    link.download = `section_${index + 1}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Image Splitter</h1>
          <p className="text-gray-600">Split your image into 5 sections with specific aspect ratios</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        {/* Preview Section */}
        {uploadedImage && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Original Image</h2>
            <div className="relative border rounded-lg overflow-hidden">
              <img
                src={uploadedImage.src}
                alt="Original"
                className="w-full h-auto"
              />
              <button 
                onClick={() => setUploadedImage(null)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Split Sections */}
        {splittedSections.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Split Sections</h2>
            <div className="grid grid-cols-2 gap-4">
              {splittedSections.map((section, index) => (
                <div key={index} className="relative border rounded-lg p-2">
                  <canvas
                    ref={el => {
                      if (el) {
                        el.width = section.width;
                        el.height = section.height;
                        el.getContext('2d').putImageData(section, 0, 0);
                      }
                    }}
                    className="w-full h-auto"
                  />
                  <button
                    onClick={() => downloadSection(section, index)}
                    className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="mt-2 text-center text-gray-600">
                    Section {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default App;