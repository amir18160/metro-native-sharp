import { create } from 'zustand';
import { ModalVariants } from '~/types/common/ModalType';

type LoadingSource = (() => boolean) | null;

interface ModalState {
    visible: boolean;
    variant: ModalVariants;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    isLoading: boolean;
    additionalJSX: React.ReactNode | null;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
    loadingSource: LoadingSource;
    showModal: (options: Partial<ModalState>) => void;
    hideModal: () => void;
    reset: () => void;
    bindLoading: (source: () => boolean, minVisibleTime?: number) => () => void;
}

const initialState: Omit<ModalState, 'showModal' | 'hideModal' | 'reset' | 'bindLoading'> = {
    isLoading: false,
    additionalJSX: null,
    visible: false,
    variant: ModalVariants.CONFIRMATION,
    title: 'Confirmation',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
    loadingSource: null,
};

let loadingInterval: number | null = null;

export const useAnimatedModalCenterStore = create<ModalState>((set) => ({
    ...initialState,

    showModal: (options) =>
        set({
            ...initialState,
            ...options,
            visible: true,
        }),

    hideModal: () => {
        if (loadingInterval) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
        set({
            visible: false,
            loadingSource: null,
            isLoading: false,
        });
    },

    reset: () => {
        if (loadingInterval) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
        set(initialState);
    },

    bindLoading: (source, minVisibleTime = 500) => {
        if (loadingInterval) {
            clearInterval(loadingInterval);
        }

        let hasStarted = false;
        let startTime = 0;

        loadingInterval = setInterval(() => {
            const loading = source();

            set({ isLoading: loading });

            // Mark when loading starts
            if (loading && !hasStarted) {
                hasStarted = true;
                startTime = Date.now();
            }

            // When loading ends
            if (hasStarted && !loading) {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(minVisibleTime - elapsed, 0);

                setTimeout(() => {
                    set({ visible: false, isLoading: false, loadingSource: null });
                    if (loadingInterval) {
                        clearInterval(loadingInterval);
                        loadingInterval = null;
                    }
                }, remaining);
            }
        }, 100);

        return () => {
            if (loadingInterval) {
                clearInterval(loadingInterval);
                loadingInterval = null;
            }
        };
    },
}));

export const modal = {
    show: (options: Partial<ModalState>) =>
        useAnimatedModalCenterStore.getState().showModal(options),

    hide: () => useAnimatedModalCenterStore.getState().hideModal(),

    confirm: (options: Partial<Omit<ModalState, 'variant'>>) => {
        useAnimatedModalCenterStore
            .getState()
            .showModal({ ...options, variant: ModalVariants.CONFIRMATION });
    },

    loading: (options: Partial<Omit<ModalState, 'variant'>> & { bindTo?: () => boolean }) => {
        const { bindTo, ...restOptions } = options;
        useAnimatedModalCenterStore.getState().showModal({
            ...restOptions,
            variant: ModalVariants.LOADING,
            isLoading: true,
        });

        if (bindTo) {
            useAnimatedModalCenterStore.getState().bindLoading(bindTo);
        }
    },

    info: (options: Partial<Omit<ModalState, 'variant'>>) => {
        useAnimatedModalCenterStore
            .getState()
            .showModal({ ...options, variant: ModalVariants.INFORMATION });
    },

    error: (options: Partial<Omit<ModalState, 'variant'>>) => {
        useAnimatedModalCenterStore
            .getState()
            .showModal({ ...options, variant: ModalVariants.ERROR });
    },

    success: (options: Partial<Omit<ModalState, 'variant'>>) => {
        useAnimatedModalCenterStore
            .getState()
            .showModal({ ...options, variant: ModalVariants.SUCCESS });
    },
};
