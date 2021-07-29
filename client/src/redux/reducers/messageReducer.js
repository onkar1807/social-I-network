import { DeleteData } from "../actions/constant"
import { messageType } from "../actions/messageAction"

const initialState = {
    users: [],
    resultUser: 0,
    data: [],
    firstLoad: false
}

export const messageReducer = (state = initialState, action) => {
    switch(action.type) {
        case messageType.ADD_USER:
            return {
                ...state,
                users: [action.payload, ...state.users]
            }
        case messageType.ADD_MESSAGES:
            return {
                ...state,
                data: state.data.map(item => (
                    item._id === action.payload.recipient ||  item._id === action.payload.sender
                    ? {
                        ...item,
                        messages: [...item.messages, action.payload],
                        result: item.result + 1
                    }
                    : item
                )),
                users: state.users.map(user => 
                    user._id === action.payload.recipient || user._id === action.payload.sender
                    ? {...user, 
                        text: action.payload.text, 
                        media: action.payload.media,
                        call: action.payload.call
                      }
                    : user
                )
            }
        case messageType.GET_CONVERSATIONS:
            return {
                ...state,
                users: action.payload.newArray,
                resultUser: action.payload.result,
                firstLoad: true
            }
        case messageType.GET_MESSAGES:
            return {
                ...state,
                data: [...state.data, action.payload]
            }
        case messageType.DELETE_MESSAGE:
            return {
                ...state,
                data: state.data.map(item => 
                    item._id === action.payload._id
                    ?  {
                        ...item,
                        messages: action.payload.newData,
                    }
                    :item
                )
            }
        case messageType.DELETE_CONVERSATION:
            return {
                ...state,
                data: DeleteData(state.data, action.payload),
                users: DeleteData(state.users, action.payload)
            }
        case messageType.USER_ONLINE_OFFLINE:
            return {
                ...state,
                users: state.users.map(user => (
                    action.payload.includes(user._id)
                    ? {...user, online: true}
                    : {...user, online: false}
                ))
            }
        default:
            return state
    }
}

