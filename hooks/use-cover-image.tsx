import { create } from 'zustand';

type CreateCoverImageStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useCoverImage = create<CreateCoverImageStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}));