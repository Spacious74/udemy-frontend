import { createReducer, on } from "@ngrx/store";
import { UserList } from "../../models/UserList";
import { cartInfoActions, userInfoActions } from "../actions/userInfo.action";
import { Cart } from "../../models/Cart";

let initialState : UserList;

export const userInfoReducer = createReducer(
    initialState,
    on(userInfoActions.loadUserSuccess, (currentState, action)=>{
        return action.payload
    })
);

let initialCartState : Cart;

export const cartInfoReducer = createReducer(
    initialCartState,
    on(cartInfoActions.loadCartSuccess, (currentState, action)=>{
        return action.payload;
    })
)