import { globalTypes } from "../actions/constant";

let initialstate = {}

export const authReducer = (state = initialstate, action) => {
    switch(action.type) {
        case globalTypes.AUTH:
            return action.payload;
        default:
            return state
    }
}