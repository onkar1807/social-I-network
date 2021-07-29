import { globalTypes } from "../actions/constant";

let initialstate = false

export const statusReducer = (state = initialstate, action) => {
    switch(action.type) {
        case globalTypes.STATUS:
            return action.payload;
        default:
            return state
    }
}