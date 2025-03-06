import { createReducer, on } from "@ngrx/store";
import { Cart } from "../../models/Cart";
import { addToCartAction, removeFromCartAction } from "../actions/cart.action";

const initialState : Cart[] = [];

export const cartReducer = createReducer(initialState, 
    on(addToCartAction, (currentState, action)=>{
        const existingCourse = currentState.find(course => course.courseId == action.payload.courseId);
        if(existingCourse) return [...currentState]
        else return [
            ...currentState, action.payload
        ]
    }),
    on(removeFromCartAction, (currentState, action)=>{
        currentState = currentState.filter(course=>course.courseId != action.payload.courseId);
        return [
            ...currentState
        ];
    })
);