'use client';

import { useState } from 'react';
import DocumentUploader from '../components/DocumentUploader';

export default function Home() {
  const [analyzedData, setAnalyzedData] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (formData: FormData) => {
    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        return;
      }

      const data = await response.json();
      setAnalyzedData(data);
      setError('');
    } catch (err) {
      setError(`An error occurred while analyzing the document: ${err}`);
    }
  };

  return (
    <div className='border-4 w-[40%] h-[40%]  my-20 flex flex-col text-orange-500 mx-auto rounded-lg  p-4 border-orange-500'>
      <h1 className="text-2xl w-fit mx-auto font-bold mb-6 ">Document Analysis</h1>
      <DocumentUploader onAnalyze={handleAnalyze} />

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {analyzedData && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Analysis Result</h2>
          <pre className="bg-gray-200 p-4 rounded">
            {JSON.stringify(analyzedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
