import { EditData, postTypes } from "../actions/constant";

export const detailPostReducer = (state = [], action) => {
    switch(action.type) {
        case postTypes.GET_POST_BY_ID:
            return [...state, action.payload]
        case postTypes.UPDATE_POST:
            return EditData(state, action.payload._id, action.payload)
        default:
            return state
    }
}