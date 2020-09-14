import { useReducer, useCallback } from "react";
import { isFunction } from "lodash";

export const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = useCallback((action) => {
    if (isFunction(action)) {
      action(dispatch);
    } else {
      dispatch(action);
    }
  }, []);

  return [state, enhancedDispatch];
};
