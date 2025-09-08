export interface IDocumentDto {
    id: string;
    fileName: string;
    fileSize: number;
    isSubbed: boolean;
    resolution: string;
    codec: string;
    encoder: string;
    type: DocumentType;
    createdAt: string;
    updatedAt: string;
}

export enum DocumentType {
    Movie,
    Episode,
}

export interface IUpdatedDocument {
    id: string;
    imdbId: string;
    season?: number | null;
    episode?: number | null;
    fileName: string;
    isSubbed?: boolean | null;
    type: DocumentType;
}
