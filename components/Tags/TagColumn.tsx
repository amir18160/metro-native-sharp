// components/TagColumn.tsx
import React from 'react';
import { View } from 'react-native';
import TagCompact from './TagCompact';
import { Tag } from '~/types/server/tags/tag';

type Props = {
    chunk: Tag[]; // up to COLUMN_SIZE items
    onDeleted?: (id: string) => void;
};

export default function TagColumn({ chunk, onDeleted }: Props) {
    return (
        <View style={{ width: 220, marginRight: 10 }}>
            {chunk.map((t) => (
                <TagCompact key={t.id} tag={t} onDeleted={onDeleted} />
            ))}
        </View>
    );
}
