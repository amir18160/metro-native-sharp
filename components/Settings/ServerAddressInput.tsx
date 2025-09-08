import { useEffect, useState } from 'react';
import AnimatedTextField, { AnimatedTextFieldProps } from '../common/AnimatedTextField';
import { useApplicationSettingsStore } from '~/stores/useApplicationSettingsStore';
import { useQueryClient } from '@tanstack/react-query';

type Props = Omit<AnimatedTextFieldProps, 'value' | 'onChangeText'>;

export default function ServerAddressInput(props: Props) {
    const settingsStore = useApplicationSettingsStore();
    const queryClient = useQueryClient();

    const [input, setInput] = useState(settingsStore.serverURL);

    useEffect(() => {
        // Update the store
        settingsStore.setServerURL(input);

        // Reset all queries so they refetch with the new serverURL
        queryClient.removeQueries();
        queryClient.invalidateQueries();
        queryClient.resetQueries();
    }, [input, queryClient]);

    return <AnimatedTextField {...props} value={input} onChangeText={setInput} />;
}
