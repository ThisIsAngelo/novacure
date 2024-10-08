import { useContext } from "react";
import { StateContext, StateContextType } from "../context";

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);

  if (context === null) {
    throw new Error(
      "useStateContext must be used within a StateContextProvider"
    );
  }

  return context;
};
