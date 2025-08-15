import { ChangeItemBase } from './change-item-base';

export interface ChangeItemDeleted extends ChangeItemBase {
    originalValue: object;
}
