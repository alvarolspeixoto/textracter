import React from "react";
import { AnalyzeDocumentResponse } from "@/interface/types";

interface ResultPageProps {
  response: AnalyzeDocumentResponse;
}

export default function Result({ response }: ResultPageProps) {
  // Filtrar blocos do tipo WORD
  const wordBlocks = response.Blocks.filter(block => block.BlockType === "WORD");
  const concatenatedWords = wordBlocks.map(block => block.Text).join(" ");
  
  // Calcular total de palavras e média de confiança
  const totalWords = wordBlocks.length;
  const averageConfidence = totalWords > 0
    ? (wordBlocks.reduce((sum, block) => sum + block.Confidence, 0) / totalWords).toFixed(2)
    : 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resultado da Análise do Documento</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Metadados do Documento:</h2>
        <p>Páginas: {response.DocumentMetadata.Pages}</p>
        <p>Versão do Modelo: {response.AnalyzeDocumentModelVersion}</p>
      </div>

      {/* Resumo dos dados dos blocos do tipo WORD */}
      <div className="mt-4 border p-2 bg-gray-100 rounded">
        <p>Total de Palavras: {totalWords}</p>
        <p>Média de Confiança: {averageConfidence}%</p>
        <h2 className="text-lg font-semibold">Concatenação simples das Palavras encontradas:</h2>
        {concatenatedWords && <p>Texto Concatenado: {concatenatedWords}</p>}
      </div>

    </div>
  );
}
