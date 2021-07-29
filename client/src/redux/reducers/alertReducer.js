import { globalTypes } from "../actions/constant";

let initialstate = {}

export const alertReducer = (state = initialstate, action) => {
    switch(action.type) {
        case globalTypes.ALERT:
            return action.payload;
        default:
            return state
    }
}