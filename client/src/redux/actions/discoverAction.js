import { getDataApi } from "../../utils/axios";
import { discoverTypes, globalTypes } from "./constant";

export const getDiscoverPost = (token) => async (dispatch) => {
    try {
        dispatch({
            type: discoverTypes.LOADING,
            payload: true
        })

        const res = await getDataApi(`post_discover`, token)
        console.log(res);

        dispatch({
            type: discoverTypes.GET_POST,
            payload: res.data
        })

        dispatch({
            type: discoverTypes.LOADING,
            payload: false
        })

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: {error: error.response.data.msg}
        })
    }
}