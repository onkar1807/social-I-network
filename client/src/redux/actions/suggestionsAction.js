import { getDataApi } from "../../utils/axios";
import { globalTypes } from "./constant";


export const suggestionTypes = {
    LOADING: 'LOADING_SUGGESTION',
    GET_USER: 'GET_USER_SUGGESTION'
}

export const getUserSuggestions = (token) => async (dispatch) => {
    try {
        dispatch({
            type: suggestionTypes.LOADING,
            payload: true
        })

        const res = await getDataApi(`suggestion_user`, token);

        dispatch({
            type: suggestionTypes.GET_USER,
            payload: res.data
        })

        dispatch({
            type: suggestionTypes.LOADING,
            payload: false
        })

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: {error: error.response.data.msg}
        })
    }
}