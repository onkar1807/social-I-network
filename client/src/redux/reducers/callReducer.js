import { globalTypes } from "../actions/constant";


export const callReducer = (state = null, action) => {
    switch(action.type) {
        case globalTypes.CALL:
            return action.payload;
        default:
            return state
    }
}