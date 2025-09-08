import { useMemo, useState } from 'react';
import { View, FlatList, Alert, Keyboard } from 'react-native';
import {
    IDocumentDto,
    DocumentType,
    IUpdatedDocument,
} from '~/types/server/documents/document-dto';

import HeaderControls from './HeaderControls';
import RenameControls from './RenameControls';
import RowItem from './RowItem';
import FooterActions from './FooterActions';
import {
    nameWithoutExtension,
    longestCommonSubstring,
    applyPrefixSuffix,
} from '~/utilities/documentHelpers';
import { useUpdateTempDocument } from '~/hooks/services/documents/useUpdateTempDocument';
import { modal } from '~/stores/useAnimatedModalCenterStore';

export default function UpdateSelectedFiles({
    selectedDocuments,
    onClose,
}: {
    selectedDocuments: IDocumentDto[];
    onClose?: () => void;
}) {
    // global fields
    const [imdbId, setImdbId] = useState<string>('');
    const [type, setType] = useState<DocumentType>(DocumentType.Episode);
    const [season, setSeason] = useState<string>(''); // keep as string for input

    // server action hook
    const updateDocument = useUpdateTempDocument();

    // global rename controls
    const [findText, setFindText] = useState<string>('');
    const [replaceText, setReplaceText] = useState<string>('');
    const [prefix, setPrefix] = useState<string>('');
    const [suffix, setSuffix] = useState<string>('');

    // local editable items
    const [items, setItems] = useState(
        selectedDocuments.map((d) => ({
            ...d,
            // editable fields
            editedFileName: d.fileName,
            episode: undefined as number | null | undefined,
            isSubbedLocal: d.isSubbed,
        }))
    );

    // computed common part
    const commonPart = useMemo(() => {
        const names = items.map((i) => nameWithoutExtension(i.editedFileName));
        return longestCommonSubstring(names);
    }, [items]);

    const applyFindReplace = () => {
        if (!findText) return;
        setItems((prev) =>
            prev.map((it) => ({
                ...it,
                editedFileName: it.editedFileName.split(findText).join(replaceText),
            }))
        );
        Keyboard.dismiss();
    };

    const applyRemoveCommon = () => {
        if (!commonPart) return;
        setItems((prev) =>
            prev.map((it) => ({
                ...it,
                editedFileName: it.editedFileName.split(commonPart).join(''),
            }))
        );
    };

    const applyPrefixSuffixAll = () => {
        setItems((prev) =>
            prev.map((it) => ({
                ...it,
                editedFileName: applyPrefixSuffix(it.editedFileName, prefix, suffix),
            }))
        );
        Keyboard.dismiss();
    };

    const updateItem = (id: string, patch: Partial<any>) => {
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    };

    const validateAndBuild = (): IUpdatedDocument[] | null => {
        if (!imdbId.trim()) {
            Alert.alert('Validation', 'Please enter an IMDB ID for all items.');
            return null;
        }

        if (type === DocumentType.Episode && !season.trim()) {
            Alert.alert('Validation', 'Please enter Season for episodes.');
            return null;
        }

        // Each item must have an episode if type is Episode
        if (type === DocumentType.Episode) {
            const missing = items.filter((it) => !Number.isFinite(Number(it.episode)));
            if (missing.length) {
                Alert.alert('Validation', 'Please set Episode number for each file.');
                return null;
            }
        }

        return items.map((it) => ({
            id: it.id,
            imdbId: imdbId,
            season: season ? Number(season) : undefined,
            episode:
                it.episode !== undefined
                    ? it.episode === null
                        ? undefined
                        : Number(it.episode)
                    : undefined,
            fileName: it.editedFileName,
            isSubbed: it.isSubbedLocal,
            type: type,
        }));
    };

    const updateAllSequentially = async (docs: IUpdatedDocument[]) => {
        let successCount = 0;
        let errorCount = 0;
        const succeededIds: string[] = [];

        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            try {
                modal.loading({
                    message: `Updating ${i + 1} of ${docs.length}...`,
                });

                await updateDocument.mutateAsync(doc);

                successCount++;
                succeededIds.push(doc.id);
            } catch {
                errorCount++;
            }
        }

        // remove successfully updated ones
        setItems((prev) => prev.filter((it) => !succeededIds.includes(it.id)));

        return { successCount, errorCount };
    };

    const onSubmit = () => {
        const built = validateAndBuild();
        if (!built) {
            modal.error({ message: 'Validation failed. Please check all fields.' });
            return;
        }

        modal.confirm({
            message: 'Are you sure you want to update these files?',
            confirmText: 'Yes, Update',
            cancelText: 'No, Cancel',
            onConfirm: async () => {
                try {
                    const { successCount, errorCount } = await updateAllSequentially(built);

                    modal.hide();
                    modal.success({
                        message: `Finished: ${successCount} succeeded, ${errorCount} failed.`,
                    });

                    if (onClose) onClose();
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Something went wrong';
                    modal.hide();
                    modal.error({ message });
                }
            },
        });
    };

    return (
        <View className="flex-1 bg-gray-50 p-2">
            <HeaderControls
                imdbId={imdbId}
                setImdbId={setImdbId}
                type={type}
                setType={setType}
                season={season}
                setSeason={setSeason}
            />

            <RenameControls
                findText={findText}
                setFindText={setFindText}
                replaceText={replaceText}
                setReplaceText={setReplaceText}
                prefix={prefix}
                setPrefix={setPrefix}
                suffix={suffix}
                setSuffix={setSuffix}
                applyFindReplace={applyFindReplace}
                applyRemoveCommon={applyRemoveCommon}
                applyPrefixSuffixAll={applyPrefixSuffixAll}
                commonPart={commonPart}
            />

            {/* Items list */}
            <FlatList
                data={items}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => <RowItem item={item} updateItem={updateItem} />}
                style={{ flex: 1 }}
            />

            <FooterActions onClose={onClose} onSubmit={onSubmit} />
        </View>
    );
}
