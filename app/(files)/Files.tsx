import FileManager from '~/components/FileManager/FileManager';
import { View } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function files() {
    return (
        <View>
            <FileManager directory={FileSystem.documentDirectory!} />
        </View>
    );
}
