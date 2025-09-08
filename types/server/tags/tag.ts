import { IOmdbSummary } from '../omdb/omdb-summary';
import { TagType } from './tag-type';

export interface Tag {
    id: string;
    type: TagType;
    description: string | null;
    isPinned: boolean;
    createdAt: string;
    omdbItemId: string;
    omdbSummary?: IOmdbSummary;
}
