import { discoverTypes } from "../actions/constant";

let initialstate = {
    loading: false,
    posts: [],
    result: 9,
    page: 2,
    firstLoad: false
}

export const discoverReducer = (state = initialstate, action) => {
    switch(action.type) {
        case discoverTypes.LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case discoverTypes.GET_POST:
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result,
                firstLoad: true
            }
        default:
            return state
    }
}