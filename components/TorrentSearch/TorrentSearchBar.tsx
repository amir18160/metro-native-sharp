import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import { TorrentSearchSource } from '~/types/local/torrentSearchSource';
import AnimatedPicker from '../common/AnimatedPicker';
import {
    stringToTorrentSearchSource,
    torrentSearchSourceToString,
} from '~/utilities/enumConverter';
import { TorrentSearchTerms } from '~/app/(torrentSearch)/TorrentSearch';
import AnimatedTextField from '../common/AnimatedTextField';
import { Ionicons } from '@expo/vector-icons';

interface IProps {
    searchTerms: TorrentSearchTerms;
    setSearchTerms: Dispatch<SetStateAction<TorrentSearchTerms>>;
}

export default function TorrentSearchBar({ searchTerms, setSearchTerms }: IProps) {
    return (
        <View className="absolute left-0 right-0  z-50 flex-1 flex-row gap-2 px-3">
            <View className="flex-1">
                <AnimatedTextField
                    placeholder="Search..."
                    variant="default"
                    showPasteButton
                    iconLeft={<Ionicons name="search" size={20} color="white" />}
                    value={searchTerms?.query}
                    onChangeText={(value) =>
                        setSearchTerms((prev: TorrentSearchTerms) => ({ ...prev, query: value }))
                    }
                />
            </View>

            <View className="flex-3">
                <AnimatedPicker
                    selectedValue={torrentSearchSourceToString(searchTerms.searchSource)}
                    onSelect={(value) =>
                        setSearchTerms((prev) => ({
                            ...prev,
                            searchSource:
                                stringToTorrentSearchSource(value) ?? TorrentSearchSource.Indexer,
                        }))
                    }
                    variant="filled"
                    options={Object.keys(TorrentSearchSource).filter((k) => isNaN(Number(k)))}
                    className="p-0"
                />
            </View>
        </View>
    );
}
