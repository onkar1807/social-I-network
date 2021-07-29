import { globalTypes } from "../actions/constant";

let initialstate = false

export const themeReducer = (state = initialstate, action) => {
    switch(action.type) {
        case globalTypes.THEME:
            return action.payload;
        default:
            return state
    }
}