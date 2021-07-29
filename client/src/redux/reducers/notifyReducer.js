import { EditData } from "../actions/constant";
import { notifyType } from "../actions/notifyAction";

const initialState = {
    loading: false,
    data: [],
    sound: false
}

export const notifyReducer = (state = initialState, action) => {
    switch(action.type) {
        case notifyType.GET_NOTIFY:
            return {
                ...state,
                data: action.payload
            }
        case notifyType.CREATE_NOTIFY:
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        case notifyType.REMOVE_NOTIFY:
            return {
                ...state,
                data: state.data.filter(item => (
                    item.id !== action.payload.id || item.url !== action.payload.url
                ))
            }
        case notifyType.UPDATE_NOTIFY:
            return {
                ...state,
                data: EditData(state.data, action.payload._id, action.payload)
            }
        case notifyType.UPDATE_SOUND:
            return {
                ...state,
                sound: action.payload
            }
        case notifyType.DELETE_ALL_NOTIFY:
            return {
                ...state,
                data: action.payload
            }
        default:
            return state
    }
}