import { Dimensions, View } from 'react-native';
import { useDebouncedValue } from '~/hooks/general/useDebouncedValue';
import { TorrentSearchSource } from '~/types/local/torrentSearchSource';
import IndexerResults from './IndexerResults';
import YtsResults from './YtsResults';
import RarbgResults from './RarbgResults';
import X1337Results from './X1337Results';

const { height } = Dimensions.get('window');

interface IProps {
    query: string;
    searchSource: TorrentSearchSource;
}

export default function TorrentSearchContent({ query, searchSource }: IProps) {
    const debouncedQuery = useDebouncedValue(query, 500);

    if (!debouncedQuery) {
        return null;
    }

    return (
        <View className="flex-1 p-4" style={{ paddingTop: 70, height: height - 70 }}>
            {searchSource === TorrentSearchSource.Indexer && (
                <IndexerResults query={debouncedQuery} />
            )}
            {searchSource === TorrentSearchSource.YTS && <YtsResults query={debouncedQuery} />}
            {searchSource === TorrentSearchSource.RARBG && <RarbgResults query={debouncedQuery} />}
            {searchSource === TorrentSearchSource.X1337 && <X1337Results query={debouncedQuery} />}
        </View>
    );
}
