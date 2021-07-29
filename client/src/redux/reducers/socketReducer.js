import { globalTypes } from "../actions/constant";


export const socketReducer = (state = [], action) => {
    switch(action.type) {
        case globalTypes.SOCKET:
            return action.payload;
        default:
            return state
    }
}