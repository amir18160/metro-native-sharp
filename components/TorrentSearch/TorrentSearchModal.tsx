import { Dimensions, View } from 'react-native';
import React from 'react';
import Modal from '~/components/common/Modal';

import { TorrentSearchTerms } from '~/app/(torrentSearch)/TorrentSearch';
import { Ionicons } from '@expo/vector-icons';
import { TorrentSearchSource } from '~/types/local/torrentSearchSource';
import {
    torrentSearchSourceToString,
    stringToTorrentSearchSource,
} from '~/utilities/enumConverter';
import AnimatedPicker from '../common/AnimatedPicker';
import AnimatedTextField from '../common/AnimatedTextField';
import { useDebouncedValue } from '~/hooks/general/useDebouncedValue';
import IndexerResults from './IndexerResults';
import RarbgResults from './RarbgResults';
import X1337Results from './X1337Results';
import YtsResults from './YtsResults';

const { height } = Dimensions.get('window');

export interface IProps {
    isVisible: boolean;
    onClose: () => void;
    searchTerms: TorrentSearchTerms;
    setSearchTerms: React.Dispatch<React.SetStateAction<TorrentSearchTerms>>;
    onSelect: (magnet: string) => void;
}

export default function TorrentSearchModal({
    isVisible,
    onClose,
    searchTerms,
    setSearchTerms,
    onSelect,
}: IProps) {
    const debouncedQuery = useDebouncedValue(searchTerms.query, 500);

    return (
        <View>
            <Modal title="Modal" visible={isVisible} onClose={onClose} scrollable={false}>
                <>
                    <View className="absolute left-0 right-0  z-50 flex-1 flex-row gap-2 px-3">
                        <View className="flex-1">
                            <AnimatedTextField
                                placeholder="Search..."
                                variant="default"
                                showPasteButton
                                iconLeft={<Ionicons name="search" size={20} color="white" />}
                                value={searchTerms?.query}
                                onChangeText={(value) =>
                                    setSearchTerms((prev: TorrentSearchTerms) => ({
                                        ...prev,
                                        query: value,
                                    }))
                                }
                            />
                        </View>

                        <View className="flex-3">
                            <AnimatedPicker
                                selectedValue={torrentSearchSourceToString(
                                    searchTerms.searchSource
                                )}
                                onSelect={(value) =>
                                    setSearchTerms((prev) => ({
                                        ...prev,
                                        searchSource:
                                            stringToTorrentSearchSource(value) ??
                                            TorrentSearchSource.Indexer,
                                    }))
                                }
                                variant="filled"
                                options={Object.keys(TorrentSearchSource).filter((k) =>
                                    isNaN(Number(k))
                                )}
                                className="p-0"
                            />
                        </View>
                    </View>
                    {debouncedQuery && (
                        <View
                            className="flex-1 p-1"
                            style={{ paddingTop: 70, height: height - 70 }}>
                            {searchTerms.searchSource === TorrentSearchSource.Indexer && (
                                <IndexerResults onSelect={onSelect} query={debouncedQuery} />
                            )}
                            {searchTerms.searchSource === TorrentSearchSource.YTS && (
                                <YtsResults onSelect={onSelect} query={debouncedQuery} />
                            )}
                            {searchTerms.searchSource === TorrentSearchSource.RARBG && (
                                <RarbgResults onSelect={onSelect} query={debouncedQuery} />
                            )}
                            {searchTerms.searchSource === TorrentSearchSource.X1337 && (
                                <X1337Results onSelect={onSelect} query={debouncedQuery} />
                            )}
                        </View>
                    )}
                </>
            </Modal>
        </View>
    );
}
