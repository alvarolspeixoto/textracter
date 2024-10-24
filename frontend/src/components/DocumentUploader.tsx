'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnalyzeDocumentResponse } from '@/interface/types';
import Result from './Result';

interface DocumentUploaderProps {
  onAnalyze: (formData: FormData) => Promise<AnalyzeDocumentResponse | undefined>;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onAnalyze }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDocumentResponse | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("feature_type", "TABLES");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    try {
      const result = await onAnalyze(formData);
      setAnalysisResult(result);
      setError(null);
    } catch {
      setError('Ocorreu um erro ao enviar o arquivo.');
    }
  };

  return (
    <div className="mx-auto rounded-lg shadow-sm bg-white max-w-md">
      {analysisResult ? (
        <Result response={analysisResult} />
      ) : (
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
                  className="w-full h-96 border rounded-lg shadow"
                  title="PDF Preview"
                />
              ) : (
                <Image 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-auto border rounded-lg shadow-xl" 
                  width={1200} 
                  height={1200} 
                />
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition-colors duration-300"
          >
            Analyze Document
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default DocumentUploader;
