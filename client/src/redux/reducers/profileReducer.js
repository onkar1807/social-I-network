import { profileTypes } from "../actions/constant";

const initialState = {
    ids: [],
    loading: false,
    users: [],
    posts: [],
}

export const profileReducer = (state = initialState, action) => {
    switch(action.type) {
        case profileTypes.LOADING:
            return {
                    ...state,
                    loading: action.payload.loading
            }
        case profileTypes.GET_USER:
            return {
                ...state,
                users: [...state.users, action.payload.user]
            }
        case profileTypes.GET_USERS_POST:
            return {
                ...state,
                posts: [...state.posts, action.payload]
            }
        case profileTypes.FOLLOW:
            return {
                ...state,
                users: state.users.map(user => 
                    (user._id === action.payload._id ? action.payload : state.users)
                )
            }
        case profileTypes.UNFOLLOW:
            return {
                ...state,
                users: state.users.map(user => 
                    (user._id === action.payload._id ? action.payload : state.users)
                )
            }
         case profileTypes.GET_PROFILE_ID:
            return {
                ...state,
                ids: [...state.ids, action.payload]
            }
        default:
            return state;
    }
}