import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IApplicationSettings {
    serverURL: string;
    _hasHydrated: boolean;
}

export interface IApplicationSettingsActions {
    setServerURL: (serverURL: string) => void;
    setHasHydrated: (hydrated: boolean) => void;
}

const initialState: IApplicationSettings = {
    serverURL: 'http://192.168.1.151:5159/api',
    _hasHydrated: false,
};

export const useApplicationSettingsStore = create<
    IApplicationSettings & IApplicationSettingsActions
>()(
    persist(
        (set) => ({
            ...initialState,
            setServerURL: (serverURL: string) => set({ serverURL: serverURL }),
            setHasHydrated: (hydrated: boolean) => set({ _hasHydrated: hydrated }),
        }),
        {
            name: 'application-settings',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    console.log(
                        'Failed to rehydrate application settings from async storage:',
                        error
                    );
                } else {
                    state?.setHasHydrated(true);
                }
            },
        }
    )
);
