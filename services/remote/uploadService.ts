// =================================================================
//                         Upload Subtitle
// =================================================================

import { AxiosResponse } from 'axios';
import apiClient from '~/api/apiClient';
import { FileEntry } from '~/components/FileManager/FileManager';
import { ApiResult } from '~/types/common/ApiResult';
import { ISubtitleUpload } from '~/types/server/upload/uploadSubtitleZipType';

export interface IUploadSubtitle {
    file: FileEntry;
}

export const uploadZipSubtitle = async (data: IUploadSubtitle) => {
    const url = 'upload/upload-zip-subtitle';

    const formData = new FormData();
    formData.append('file', {
        uri: data.file.uri,
        name: data.file.name,
        type: 'application/zip',
    } as any);

    const result: AxiosResponse<ApiResult<ISubtitleUpload>> = await apiClient.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return result.data;
};
