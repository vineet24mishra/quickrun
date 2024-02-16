import { createStore } from "redux";
import {rootReducer} from "../reducers/Reducers";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";


export const store = createStore(rootReducer, applyMiddleware(thunk));
