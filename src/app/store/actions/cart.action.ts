import { createAction, props } from "@ngrx/store";
import { Cart } from "../../models/Cart";

export const addToCartAction = createAction("[Cart] Add", props<{payload : Cart}>());
export const removeFromCartAction = createAction("[Cart] Remove", props<{payload : Partial<Cart>}>());
