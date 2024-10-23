from enum import Enum
from pydantic import BaseModel


class Type(Enum):
    QUERY = "QUERY"
    QUERY_RESULT = "QUERY_RESULT"
    WORD = "WORD"


class BoundingBox(BaseModel):
    Width: float
    Height: float
    Left: float
    Top: float


class Point(BaseModel):
    X: float
    Y: float


class Geometry(BaseModel):
    BoundingBox: BoundingBox
    Polygon: list[Point]


class BaseBlock(BaseModel):
    Confidence: float
    Text: str
    TextType: str
    Geometry: Geometry
    Id: str


class DocumentMetadata(BaseModel):
    Pages: int


class WordBlock(BaseBlock):
    BlockType: Type = Type.WORD


class Relationship(BaseModel):
    Type: str
    Ids: list[str]


class QueryBlock(BaseModel):
    BlockType: Type = Type.QUERY
    Id: str
    Relationships: list[Relationship]
    Query: dict


class Query(BaseModel):
    Text: str


class QueryResultBlock(BaseBlock):
    BlockType: Type = Type.QUERY_RESULT


class TextractResponse(BaseModel):
    DocumentMetadata: DocumentMetadata
    Blocks: list[WordBlock | QueryBlock | QueryResultBlock]
    AnalyzeDocumentModelVersion: str
    ResponseMetadata: dict
