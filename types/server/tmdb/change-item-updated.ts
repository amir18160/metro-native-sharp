import { ChangeItemBase } from './change-item-base';

export interface ChangeItemUpdated extends ChangeItemBase {
    originalValue: object;
    value: object;
}
