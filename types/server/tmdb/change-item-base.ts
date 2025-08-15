import { ChangeAction } from './change-action';

export interface ChangeItemBase {
    action: ChangeAction;
    id: string;
    iso_639_1: string;
    time: Date;
}
