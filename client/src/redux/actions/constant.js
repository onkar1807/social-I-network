export const globalTypes = {
    AUTH: 'AUTH',
    ALERT: 'ALERT',
    THEME: 'THEME',
    STATUS: 'STATUS',
    MODAL: 'MODAL',
    SOCKET: 'SOCKET',
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    CALL: 'CALL',
    PEER: 'PEER'
}

export const profileTypes = {
    LOADING: 'LOADING',
    GET_USER: 'GET_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    GET_PROFILE_ID: 'GET_PROFILE_ID',
    GET_USERS_POST: 'GET_USERS_POST',
}

export const postTypes = {
    CREATE_POST: 'CREATE_POST',
    UPDATE_POST: ' UPDATE_POST',
    GET_POST: 'GET_POST',
    LOADING_POST: 'LOADING_POST',
    GET_POST_BY_ID: 'GET_POST_BY_ID',
    DELETE_POST: 'DELETE_POST'
}

export const discoverTypes = {
    LOADING: 'LOADING_DISCOVER',
    GET_POST: 'GET_DISCOVER_POST',
    UPDATE_POST: 'UPDATE_DISCOVER_POST'
}

export const EditData = (data, id, post) => {
    const newData = data.map(item => (
        item._id === id ? post : item
    ))
    return newData
}

export const DeleteData = (data, id) => {
    const newData = data.filter(item => item._id !== id)
    return newData
}