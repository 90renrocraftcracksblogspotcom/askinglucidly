import { StateCreator } from "zustand";
import { ChatModel } from "../../../generated";

type State = {
  model: ChatModel;
  localMode: boolean;
  proMode: boolean;
};

type Actions = {
  setModel: (model: ChatModel) => void;
  toggleLocalMode: () => void;
  toggleProMode: () => void;
};

export type ConfigStore = State & Actions;

export const createConfigSlice: StateCreator<
  ConfigStore,
  [],
  [],
  ConfigStore
> = (set) => ({
  model: ChatModel.SONAR_FREE,
  localMode: false,
  proMode: false,
  setModel: (model: ChatModel) => set({ model }),
  toggleLocalMode: () =>
    set((state) => ({ ...state, localMode: false })),
  toggleProMode: () =>
    set((state) => ({ ...state, proMode: !state.proMode })),
});
