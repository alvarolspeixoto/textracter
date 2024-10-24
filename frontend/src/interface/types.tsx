interface DocumentMetadata {
  Pages: number;
}

interface BoundingBox {
  Width: number;
  Height: number;
  Left: number;
  Top: number;
}

interface PolygonPoint {
  X: number;
  Y: number;
}

interface Geometry {
  BoundingBox: BoundingBox;
  Polygon: PolygonPoint[];
}

interface Relationship {
  Type: string;
  Ids: string[];
}

// Bloco do tipo WORD
interface WordBlock {
  Confidence: number;
  Text: string;
  TextType: string;
  Geometry: Geometry;
  Id: string;
  BlockType: "WORD";
}

// Bloco do tipo QUERY
interface QueryBlock {
  BlockType: "QUERY";
  Id: string;
  Relationships?: Relationship[]; // Presente apenas em blocos QUERY
  Query: {
    Text: string;
  };
}

// Bloco do tipo QUERY_RESULT
interface QueryResultBlock {
  Confidence: number;
  Text: string;
  Geometry: Geometry;
  Id: string;
  BlockType: "QUERY_RESULT";
}

// Bloco genérico que pode ser qualquer um dos três tipos acima
type Block = WordBlock | QueryBlock | QueryResultBlock;

export interface AnalyzeDocumentResponse {
  DocumentMetadata: DocumentMetadata;
  Blocks: Block[];
  AnalyzeDocumentModelVersion: string;
  ResponseMetadata: object; // Pode ser detalhado se houver mais informações
}
