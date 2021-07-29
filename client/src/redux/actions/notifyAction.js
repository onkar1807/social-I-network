import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from "../../utils/axios"
import { globalTypes } from "./constant"

export const notifyType = {
    GET_NOTIFY: 'GET_NOTIFY',
    CREATE_NOTIFY: 'CREATE_NOTIFY',
    REMOVE_NOTIFY: 'REMOVE_NOTIFY',
    UPDATE_NOTIFY: ' UPDATE_NOTIFY',
    UPDATE_SOUND: 'UPDATE_SOUND',
    DELETE_ALL_NOTIFY: 'DELETE_ALL_NOTIFY'
}


export const createNotify = ({notify, auth, socket}) => async (dispatch) => {
    try {
        const res = await postDataApi('notify', notify, auth.token);

        socket.emit('createNoyify', {
            ...res.data.notify,
            user: {
                username: auth.user.username,
                avatar: auth.user.avatar
            }
        })

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        })
    }
}

export const removeNotify = ({notify, auth, socket}) => async (dispatch) => {
    try {
        const res = await deleteDataApi(`notify/${notify.id}?url=${notify.url}`, auth.token);
        
        socket.emit('removeNoyify', notify)

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        })
    }
}

export const getNotify = (token, socket) => async (dispatch) => {
    try {
        const res = await getDataApi(`notify`, token);

        dispatch({
            type: notifyType.GET_NOTIFY,
            payload: res.data.notifies
        })
    
    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        })
    }
}

export const isReadNotify = ({msg, auth}) => async(dispatch) => {

    const newNotify = {...msg, isRead: true}

    dispatch({
        type: notifyType.UPDATE_NOTIFY,
        payload: newNotify
    })

    try {
        await patchDataApi(`isReadNotify/${msg._id}`, null, auth.token)
    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        })
    }
}

export const deleteAllNotification = (token) => async(dispatch) => {
    dispatch({
        type: notifyType.DELETE_ALL_NOTIFY,
        payload: []
    })

    try {
        await deleteDataApi(`delete_Notify`, token)

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        })
    }
}

