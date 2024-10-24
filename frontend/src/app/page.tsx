'use client';

import { useState } from 'react';
import DocumentUploader from '../components/DocumentUploader';
import { AnalyzeDocumentResponse } from '@/interface/types';

export default function Home() {
  const [error, setError] = useState('');

  const handleAnalyze = async (formData: FormData): Promise<AnalyzeDocumentResponse | undefined> => {
    try {
      const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      // const backendBaseUrl = "http://localhost:8000/api";
      const response = await fetch(`${backendBaseUrl}/analyze-document`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        return;
      }

      const data = await response.json();
      setError('');
      return data;
    } catch {
      setError("An error occurred while analyzing the document.");
    }
  };

  return (
    <div className='border-4 w-[40%] h-[40%]  my-20 flex flex-col text-orange-500 mx-auto rounded-lg  p-4 border-orange-500'>
      <h1 className="text-2xl w-fit mx-auto font-bold mb-6 ">Document Analysis</h1>
      <DocumentUploader onAnalyze={handleAnalyze} />

      {error && <p className="mx-auto text-red-500 mt-4">{error}</p>}

    </div>
  );
}
