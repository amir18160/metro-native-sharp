import { SearchContainer } from './search-container';
import { DateRange } from './date-range';

export interface SearchContainerWithDates<T> extends SearchContainer<T> {
    dates: DateRange;
}
