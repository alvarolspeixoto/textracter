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

  // Filtrar QUERY e QUERY_RESULT
  const queries = response.Blocks.filter(block => block.BlockType === "QUERY");
  const queryResults = response.Blocks.filter(block => block.BlockType === "QUERY_RESULT");

  // Criar um mapeamento de resultados de consulta por ID
  const queryResultsMap = queryResults.reduce((acc, block) => {
    acc[block.Id] = block;
    return acc;
  }, {} as Record<string, typeof queryResults[0]>);

  console.log(queryResultsMap);

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

      {/* Div para blocos do tipo QUERY e suas respostas QUERY_RESULT */}
      <h2 className="text-lg font-semibold mb-2">Consultas e Resultados:</h2>
      {queries.map((queryBlock) => (
        <div key={queryBlock.Id} className="border p-2 mb-2">
          <h3 className="font-medium">Query: {queryBlock.Query.Text}</h3>
          {queryResultsMap[queryBlock.Id] && (
            <div className="mt-2 border-t pt-2">
              <h4 className="font-medium">Resultado da Query:</h4>
              <p>{queryResultsMap[queryBlock.Id].Text}</p>
              <p>Confiança: {queryResultsMap[queryBlock.Id].Confidence}%</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
