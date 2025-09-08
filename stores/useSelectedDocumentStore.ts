import { create } from 'zustand';
import { IDocumentDto } from '~/types/server/documents/document-dto';

interface ISelectedDocumentsState {
    selectedDocument: IDocumentDto[] | null;
}

interface ISelectedDocumentsActions {
    setSelectedDocuments: (selectedDocument: IDocumentDto[]) => void;
    getSelectedDocuments: () => IDocumentDto[] | null;
    reset: () => void;
}

const initialState: ISelectedDocumentsState = {
    selectedDocument: null,
};

export const useSelectedDocumentStore = create<
    ISelectedDocumentsActions & ISelectedDocumentsState
>()((set, get) => ({
    ...initialState,
    setSelectedDocuments: (selectedDocument: IDocumentDto[]) => set({ selectedDocument }),
    getSelectedDocuments: () => get().selectedDocument,
    reset: () => set(initialState),
}));
