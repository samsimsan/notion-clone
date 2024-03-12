//"Zustand - Complete Tutorial" -> https://www.youtube.com/watch?v=_ngCLZ5Iz-0
import { create } from "zustand";

type SearchStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    toggle: () => void;
};


export const useSearch = create<SearchStore>((set, get) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    toggle: () => set({ isOpen: !get().isOpen })
}))




/*
 In Zustand we manage the states through the store. 
 The store contains different custom hooks which we can import to the compoents we need.

Since this is in typescript, we begin by create the type.
we then pass it to 'create'

in the function, 'create', we define the initial value of the state that we defined
the 'set' and 'get' are functions through which we can update this value.


*/