import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { UserList } from "../../models/UserList";

export const userInfoActions = createActionGroup({
    source : 'User Info API',
    events : {
        'load user' : emptyProps(),
        'load user success' : props<{payload : UserList | null}>(),
        'load user failure' : emptyProps()
    }
})