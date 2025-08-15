import { View } from 'react-native';
import { useState } from 'react';
import { Button } from '~/components/TestButton';
import { TorrentSearchSource } from '~/types/local/torrentSearchSource';
import TorrentSearchModal from '~/components/TorrentSearch/TorrentSearchModal';

export interface TorrentSearchTerms {
    query: string;
    searchSource: TorrentSearchSource;
}

export default function TorrentSearch() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerms, setSearchTerms] = useState<TorrentSearchTerms>({
        query: '',
        searchSource: TorrentSearchSource.Indexer,
    });

    return (
        <View>
            <Button title="Modal" onPress={() => setIsModalOpen(true)} />
            <TorrentSearchModal
                onSelect={(magnet: string) => console.log(magnet)}
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                searchTerms={searchTerms}
                setSearchTerms={setSearchTerms}
            />
        </View>
    );
}
