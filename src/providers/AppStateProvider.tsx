"use client";

import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";
import { Townhouse, ViewMode, FilterState, ModalState, TownhouseStatus } from "@/lib/types";

interface AppState {
  townhouses: Townhouse[];
  viewMode: ViewMode;
  filters: FilterState;
  showPricing: boolean;
  compareIds: number[];
  activeModal: ModalState | null;
  hoveredId: number | null;
}

type Action =
  | { type: "SET_FILTER"; payload: Partial<FilterState> }
  | { type: "TOGGLE_PRICING" }
  | { type: "TOGGLE_COMPARE"; payload: number }
  | { type: "CLEAR_COMPARE" }
  | { type: "SET_MODAL"; payload: ModalState | null }
  | { type: "SET_HOVERED"; payload: number | null }
  | { type: "UPDATE_STATUS"; payload: { id: number; status: TownhouseStatus } };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "TOGGLE_PRICING":
      return { ...state, showPricing: !state.showPricing };
    case "TOGGLE_COMPARE": {
      const id = action.payload;
      const ids = state.compareIds.includes(id)
        ? state.compareIds.filter((i) => i !== id)
        : state.compareIds.length < 4
          ? [...state.compareIds, id]
          : state.compareIds;
      return { ...state, compareIds: ids };
    }
    case "CLEAR_COMPARE":
      return { ...state, compareIds: [] };
    case "SET_MODAL":
      return { ...state, activeModal: action.payload };
    case "SET_HOVERED":
      return { ...state, hoveredId: action.payload };
    case "UPDATE_STATUS":
      return {
        ...state,
        townhouses: state.townhouses.map((th) =>
          th.id === action.payload.id
            ? { ...th, status: action.payload.status }
            : th
        ),
      };
    default:
      return state;
  }
}

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<Dispatch<Action> | null>(null);

export function AppStateProvider({
  children,
  viewMode,
  initialTownhouses,
}: {
  children: ReactNode;
  viewMode: ViewMode;
  initialTownhouses: Townhouse[];
}) {
  const [state, dispatch] = useReducer(appReducer, {
    townhouses: initialTownhouses,
    viewMode,
    filters: { status: "all", beds: "all", stage: "all" },
    showPricing: viewMode === "internal",
    compareIds: [],
    activeModal: null,
    hoveredId: null,
  });

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) throw new Error("useAppDispatch must be used within AppStateProvider");
  return context;
}
