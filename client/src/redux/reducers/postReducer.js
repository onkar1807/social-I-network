import { DeleteData, EditData,  postTypes } from "../actions/constant";

let initialstate = {
    loading: false,
    posts: [],
    page: 2,
    result: 0
}

export const postReducer = (state = initialstate, action) => {
    switch(action.type) {
        case postTypes.CREATE_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            };

        case postTypes.LOADING_POST:
            return {
                ...state,
                loading: action.payload
            };

        case postTypes.GET_POST:
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result
            };

        case postTypes.UPDATE_POST:
            return {
                ...state,
                posts: EditData(state.posts, action.payload._id, action.payload)
            }
        case postTypes.DELETE_POST:
            return {
                ...state,
                posts: DeleteData(state.posts, action.payload._id)
            }
            
        default:
            return state
    }
}