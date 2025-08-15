import * as FileSystem from 'expo-file-system';

import { folders } from '~/constants/folders';

export const initializeFileSystem = async () => {
    const root = FileSystem.documentDirectory;

    if (root === undefined) throw new Error('Root directory is undefined');

    const promises = Object.values(folders).map(async (folder: string) => {
        const fullPath = root + folder;
        const folderExists = await FileSystem.getInfoAsync(fullPath);
        if (!folderExists.exists) {
            await FileSystem.makeDirectoryAsync(fullPath);
        }
    });

    await Promise.all(promises);
};
