import { ChangeItemBase } from './change-item-base';

export interface Change {
    items: ChangeItemBase[];
    key: string;
}
