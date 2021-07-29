import { suggestionTypes } from "../actions/suggestionsAction";

let initialstate = {
    loading: false,  
    users: []
}

export const suggestionReducer = (state = initialstate, action) => {
    switch(action.type) {
        case suggestionTypes.LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case suggestionTypes.GET_USER:
            return {
                ...state,
                users: action.payload.users
            }
        default:
            return state
    }
}