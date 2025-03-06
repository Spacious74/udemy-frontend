import { createReducer, on } from "@ngrx/store";
import { UserList } from "../../models/UserList";
import { userInfoActions } from "../actions/userInfo.action";

let initialState : UserList;

export const userInfoReducer = createReducer(
    initialState,
    on(userInfoActions.loadUserSuccess, (currentState, action)=>{
        return action.payload
    })
);