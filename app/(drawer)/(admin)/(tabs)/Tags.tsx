import { View } from 'react-native';
import CreateTagModal from '~/components/Tags/CreateTagModal';
import ShowTags from '~/components/Tags/ShowTags';

export default function Tags() {
    return (
        <View className="mb-20 flex-1">
            <CreateTagModal />
            <ShowTags />
        </View>
    );
}
