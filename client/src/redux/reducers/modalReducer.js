import { globalTypes } from "../actions/constant";

let initialstate = false

export const modalReducer = (state = initialstate, action) => {
    switch(action.type) {
        case globalTypes.MODAL:
            return action.payload;
        default:
            return state
    }
}