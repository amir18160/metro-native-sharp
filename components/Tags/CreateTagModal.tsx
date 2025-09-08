import { View } from 'react-native';
import { useState } from 'react';
import Modal from '../common/Modal';
import { useCreateTag } from '~/hooks/services/tags/useCreateTag';
import AnimatedTextField from '../common/AnimatedTextField';
import { CreateTagParams } from '~/services/remote/tagService';
import { TagType } from '~/types/server/tags/tag-type';
import AnimatedPicker from '../common/AnimatedPicker';
import { stringToTagType, tagTypeToString } from '~/utilities/enumConverter';
import { AnimatedButton } from '../common/AnimatedButton';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { modal } from '~/stores/useAnimatedModalCenterStore';
import SelectOMDbItem from '../OMDb/SelectOMDbItem';
import { OmdbItem } from '~/types/server/omdb/omdb-item';

export default function CreateTagModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [tagDetails, setTagDetails] = useState<CreateTagParams>({
        isPinned: false,
        description: '',
        omdbItemId: '',
        type: TagType.New,
    });

    const onSelectOMDbItem = (omdb: OmdbItem | null) => {
        if (!omdb) {
            setTagDetails((prev) => ({ ...prev, omdbItemId: '' }));
            return;
        }

        setTagDetails((prev) => ({ ...prev, omdbItemId: omdb.id }));
    };

    const createTag = useCreateTag();

    const onCreateHandler = () => {
        if (tagDetails.omdbItemId === '') {
            modal.error({ message: 'OMDB Id is required' });
            return;
        }

        modal.loading({ message: 'Creating tag...' });
        createTag.mutate(tagDetails, {
            onError: (error) => modal.error({ message: error.message ?? 'Something went wrong' }),
            onSuccess: () => {
                setIsModalOpen(false);
                modal.success({ message: 'Tag created successfully' });
            },
        });
    };

    return (
        <View className="p-4">
            <AnimatedButton
                title="Create Tag"
                onPress={() => setIsModalOpen(true)}
                isLoading={createTag.isPending}
                disabled={createTag.isPending}
                leftIcon={<MaterialCommunityIcons name="plus" size={20} color="white" />}
            />
            <Modal
                onClose={() => setIsModalOpen(false)}
                visible={isModalOpen}
                title="Create/Edit Tag">
                <View className="gap-4">
                    <AnimatedButton
                        title="Create"
                        onPress={onCreateHandler}
                        isLoading={createTag.isPending}
                        disabled={createTag.isPending}
                        size="xl"
                        leftIcon={<MaterialCommunityIcons name="plus" size={20} color="white" />}
                    />

                    <AnimatedTextField
                        placeholder="Enter Tag Description"
                        iconLeft={<Entypo name="info" size={20} color="white" />}
                        onChangeText={(text) => setTagDetails({ ...tagDetails, description: text })}
                        value={tagDetails.description}
                        label="Description"
                        labelColor="text-slate-700"
                    />

                    <SelectOMDbItem value={tagDetails.omdbItemId} onSelect={onSelectOMDbItem} />

                    <View className="mt-4 flex-row gap-3">
                        <View className="flex-1">
                            <AnimatedPicker
                                label="Type"
                                labelColor="text-base text-black dark:text-white"
                                options={Object.keys(TagType).filter((k) => isNaN(Number(k)))}
                                onSelect={(value) =>
                                    setTagDetails({ ...tagDetails, type: stringToTagType(value) })
                                }
                                selectedValue={tagTypeToString(tagDetails.type)}
                            />
                        </View>

                        <View className="flex-1">
                            <AnimatedPicker
                                label="IsPinned"
                                labelColor="text-base text-black dark:text-white"
                                options={['yes', 'no']}
                                selectedValue={tagDetails.isPinned ? 'yes' : 'no'}
                                onSelect={(value) =>
                                    setTagDetails({ ...tagDetails, isPinned: value === 'yes' })
                                }
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
