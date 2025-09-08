import { View } from 'react-native';
import { useSelectedDocumentStore } from '~/stores/useSelectedDocumentStore';
import { NoData } from '~/components/NoData/NoData';
import UpdateSelectedFiles from '~/components/Documents/UpdateSelectedDocuments';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpdateDocuments() {
    const selectedDocuments = useSelectedDocumentStore((state) => state.selectedDocument);

    if (!selectedDocuments)
        return (
            <View className="flex-1 items-center justify-center">
                <NoData />
            </View>
        );

    return (
        <View className="flex-1">
            <SafeAreaView edges={['bottom']} className="flex-1">
                <UpdateSelectedFiles selectedDocuments={selectedDocuments} />
            </SafeAreaView>
        </View>
    );
}
