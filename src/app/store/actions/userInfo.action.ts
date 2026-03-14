import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { UserList } from "../../models/UserList";
import { Cart } from "../../models/Cart";

export const userInfoActions = createActionGroup({
    source : 'User Info API',
    events : {
        'load user' : emptyProps(),
        'load user success' : props<{payload : UserList | null}>(),
        'load user failure' : emptyProps()
    }
});

export const cartInfoActions = createActionGroup({
    source : "Cart info API",
    events : {
        'load cart' : emptyProps(),
        'load cart success' : props<{payload : Cart | null}>(),
        'load user failure' : emptyProps()
    }
})
