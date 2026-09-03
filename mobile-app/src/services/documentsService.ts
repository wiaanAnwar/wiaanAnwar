import { apiRequest } from './httpClient';
import { DocumentRecord, DocumentType, DocumentStatus } from '../data/documents';

interface ApiDocument {
  id: string;
  type: DocumentType;
  ref: string;
  bookingRef: string | null;
  titleEn: string;
  titleAr: string;
  date: string;
  amountUsd: number | null;
  status: DocumentStatus;
}

export const documentsService = {
  async listDocuments(): Promise<DocumentRecord[]> {
    const { documents } = await apiRequest<{ documents: ApiDocument[] }>('/documents');
    return documents.map((d) => ({
      id: d.id,
      type: d.type,
      ref: d.ref,
      tripRef: d.bookingRef ?? undefined,
      titleEn: d.titleEn,
      titleAr: d.titleAr,
      date: new Date(d.date),
      amountUsd: d.amountUsd ?? undefined,
      status: d.status,
    }));
  },
};
