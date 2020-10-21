import { combineReducers } from "redux";
import { History } from "history";
import { routerMiddleware, connectRouter } from "connected-react-router";
import history from "../history/history";
import { createStore, applyMiddleware } from "@reduxjs/toolkit";
import thunk, { ThunkMiddleware } from "redux-thunk";
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import ProjectSliceReducer from "../features/Data/ProjectSlice";
export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;

const rootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    projectSliceReducer: ProjectSliceReducer,
  });

export default function configureStore(preloadedState: Object) {
  const store = createStore(
    rootReducer(history),
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history),
        thunk as ThunkMiddleware<AppState>
      )
    )
  );
  return store;
}

export type AppState = ReturnType<typeof rootReducer>;
