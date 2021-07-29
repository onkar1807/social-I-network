import { globalTypes } from "../actions/constant";


export const onlineReducer = (state = [], action) => {
    switch(action.type) {
        case globalTypes.ONLINE:
            return [...state, action.payload]
        case globalTypes.OFFLINE:
            return state.filter(item => item !== action.payload)
        default:
            return state
    }
}