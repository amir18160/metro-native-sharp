import { WatchProviderItem } from './watch-provider-item';

export interface WatchProviders {
    link: string;
    flatRate: WatchProviderItem[];
    rent: WatchProviderItem[];
    buy: WatchProviderItem[];
    free: WatchProviderItem[];
    ads: WatchProviderItem[];
}
