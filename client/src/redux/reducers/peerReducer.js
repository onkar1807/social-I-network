import { globalTypes } from "../actions/constant";


export const peerReducer = (state = null, action) => {
    switch(action.type) {
        case globalTypes.PEER:
            return action.payload;
        default:
            return state
    }
}