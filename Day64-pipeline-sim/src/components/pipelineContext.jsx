import React, { createContext, useState, useCallback } from "react";
import PipelineModel from "./pipelineModel";

export const PipelineContext = createContext(null);

/*
 Provider holds the simulation state & exposes step/play/reset etc.
*/

export function Provider({ children }) {
  const initial = PipelineModel.initialState();
  const [state, setState] = useState(initial);

  const step = useCallback(() => {
    setState((prev) => PipelineModel.step(prev));
  }, []);

  const reset = useCallback(() => {
    setState(PipelineModel.initialState());
  }, []);

  const [autoplay, setAutoplay] = useState(false);
  const [forwarding, setForwarding] = useState(true);

  // keep forwarding in model
  React.useEffect(() => {
    setState((prev) => ({ ...prev, forwarding }));
  }, [forwarding]);

  // expose a convenient API
  const api = {
    ...state,
    step,
    reset,
    autoplay,
    setAutoplay,
    setForwarding,
    forwarding,
  };

  return (
    <PipelineContext.Provider value={api}>{children}</PipelineContext.Provider>
  );
}
