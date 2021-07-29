import { DeleteData, globalTypes } from './constant'
import { deleteDataApi, getDataApi, postDataApi } from '../../utils/axios'

export const messageType = {
    ADD_USER: ' ADD_USER',
    ADD_MESSAGES: ' ADD_MESSAGES',
    FIRST_LOAD: 'FIRST_LOAD',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    DELETE_MESSAGE: 'DELETE_MESSAGE',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    USER_ONLINE_OFFLINE: 'USER_ONLINE_OFFLINE'
}


export const addUser = ({ user, message }) => async (dispatch) => {
    if(message.users.every(item => item._id !== user._id)) {
        dispatch({
            type: messageType.ADD_USER,
            payload: { ...user, text: '', media: [] }
        })
    }
}


export const addMessages = ({msg, auth, socket}) => async (dispatch) => {
   
    dispatch({ type: messageType.ADD_MESSAGES, payload: msg })

    const { _id, avatar, fullname, username } = auth.user

    // Socket
    socket.emit('addMessage', {...msg, user: { _id, avatar, fullname, username } } )

    try {
        const res = await postDataApi('message', msg, auth.token);

    } catch(error) {
        dispatch({ type: globalTypes.ALERT, 
            payload: { error: error.response.data.msg }
        })
    }
}


export const getConversations = ({auth}) => async (dispatch) => {
    try {

        const res = await getDataApi('conversation', auth.token);
       
        let newArray = []
        res.data.conversations.forEach(item => (
            item.recipients.forEach(cv => {
                if(cv._id !== auth.user._id) {
                    newArray.push({...cv, text: item.text, media: item.media, call: item.call})
                }
            })
        ))


        dispatch({
            type: messageType.GET_CONVERSATIONS,
            payload: {newArray, result: res.data.result}
        })

       
    } catch (error) {
        // dispatch({ type: globalTypes.ALERT, 
        //     payload: { error: error.response.data.msg }
        // })
    }
}


export const getMessages = ({auth, id}) => async (dispatch) => {
    
    try {
        const res = await getDataApi(`message/${id}`, auth.token);

        const newData = {...res.data, messages: res.data.messages.reverse()}

        dispatch({
            type: messageType.GET_MESSAGES,
            payload: {...newData, _id: id}
        })

    } catch(error) {
        // dispatch({ type: globalTypes.ALERT, 
        //     payload: { error: error.response.data.msg }
        // })
    }
    
}


export const deleteMessage = ({ data, auth, msg }) => async (dispatch) => {
    const newData = DeleteData(data, msg._id)
   
    dispatch({
        type: messageType.DELETE_MESSAGE,
        payload: {newData, _id: msg.recipient}
    })

    try {   
        const res = await deleteDataApi(`message/${msg._id}`, auth.token)
       
    } catch (error) {
        dispatch({ type: globalTypes.ALERT, 
            payload: { error: error.response.data.msg }
        })
    }
}


export const deleteConversation = ({auth, id}) => async (dispatch) => {
    dispatch({type: messageType.DELETE_CONVERSATION, payload: id})

    try {
        await deleteDataApi(`conversation/${id}`, auth.token)
    } catch (error) {
        dispatch({ type: globalTypes.ALERT, 
            payload: { error: error.response.data.msg }
        })
    }
}