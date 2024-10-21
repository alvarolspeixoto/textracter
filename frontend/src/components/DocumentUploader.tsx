'use client';

import { useState } from 'react';
import Image from 'next/image';

interface DocumentUploaderProps {
  onAnalyze: (formData: FormData) => void | Promise<void>;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onAnalyze }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [featureType, setFeatureType] = useState("TABLES");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("feature_type", featureType);

    await onAnalyze(formData);
  };

  return (
    <div className="p-6 mx-auto rounded-lg shadow-sm bg-white max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-gray-700 font-medium">Upload Document:</label>
        <div className="relative">
          <input
            type="file"
            accept="image/png, image/jpeg, application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-orange-500 file:text-white
            hover:file:bg-orange-600
            cursor-pointer"
          />
        </div>
        
        {previewUrl && (
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Preview:</p>
            {file?.type === 'application/pdf' ? (
              <iframe
                src={previewUrl}
                className="w-full h-96 rounded-lg shadow"
                title="PDF Preview"
              />
            ) : (
              <Image 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-auto rounded-lg shadow" 
                width={800} 
                height={800} 
              />
            )}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Feature Type:</label>
          <select
            value={featureType}
            onChange={(e) => setFeatureType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:ring-2 focus:ring-orange-500"
          >
            <option value="TABLES">Tables</option>
            <option value="QUERIES">Queries</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition-colors duration-300"
        >
          Analyze Document
        </button>
      </form>
    </div>
  );
};

export default DocumentUploader;
