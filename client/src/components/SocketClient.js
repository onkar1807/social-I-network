import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { globalTypes, postTypes } from '../redux/actions/constant';
import { notifyType } from '../redux/actions/notifyAction';
import audioBell from '../audio/got-it-done-613.mp3'
import { messageType } from '../redux/actions/messageAction';


const spanNotification = (body, icon, url, title) => {
    let option = {
        body, icon,
    }
    let n = new Notification(title, option)

    n.onclick = (e) => {
        e.preventDefault()
        window.open(url, '_blanck')
    }
}

const SocketClient = () => {

    const { auth, socket, notify, online, call } = useSelector(state => state);
    const dispatch = useDispatch();

    const audioRef = useRef()

    // Join-User
    useEffect(() => {
        socket.emit('joinUser', auth.user)
    },[socket, auth.user])

    // likes
    useEffect(() => {
        socket.on('likeToClient', newPost => {
            dispatch({ type: postTypes.UPDATE_POST, payload: newPost })
        })
        return () => socket.off('likeToClient')
    },[socket, dispatch])

    // unlikes
    useEffect(() => {
        socket.on('unLikeToClient', newPost => {
            dispatch({ type: postTypes.UPDATE_POST, payload: newPost })
        })
        return () => socket.off('unLikeToClient')
    },[socket, dispatch])

    // Comments
    useEffect(() => {
        socket.on('createCommentToClient', newPost => {
            dispatch({ type: postTypes.UPDATE_POST, payload: newPost })
        })
        return () => socket.off('createCommentToClient')
    },[socket, dispatch])

    // Delete Comments
    useEffect(() => {
        socket.on('deleteCommentToClient', newPost => {
            dispatch({ type: postTypes.UPDATE_POST, payload: newPost })
        })
        return () => socket.off('deleteCommentToClient')
    },[socket, dispatch])

    // Follow
    useEffect(() => {
        socket.on('followToClient', newUser => {
            localStorage.setItem("user", JSON.stringify(newUser))
            dispatch({
                type: globalTypes.AUTH,
                payload: {
                    ...auth, 
                    user: newUser
                }
            })
        })
        return () => socket.off('followToClient')
    },[socket, auth.user, dispatch])

    // Unfollow
    useEffect(() => {
        socket.on('unfollowToClient', newUser => {
            localStorage.setItem("user", JSON.stringify(newUser))
            dispatch({
                type: globalTypes.AUTH,
                payload: {
                    ...auth, 
                    user: newUser
                }
            })
        })
        return () => socket.off('unfollowToClient')
    },[socket, auth, dispatch])

    // Notification 
    useEffect(() => {
        socket.on('createNoyifyToClient', notify => {
            dispatch({
                type: notifyType.CREATE_NOTIFY,
                payload: notify
            })

            if(notify.sound) audioRef.current.play()
            
            spanNotification(
                notify.user.username + ' ' + notify.text,
                notify.user.avatar,
                notify.url,
                'V-NETWORK'
            )
        })
        return () => socket.off('createNoyifyToClient')
    },[socket, dispatch])

    useEffect(() => {
        socket.on('removeNoyifyToClient', notify => {
            dispatch({
                type: notifyType.REMOVE_NOTIFY,
                payload: notify
            })
        })
        return () => socket.off('removeNoyifyToClient')
    },[socket, dispatch])


    // Message
    useEffect(() => {
        socket.on('addMessageToClient', msg => {
            dispatch({
                type: messageType.ADD_MESSAGES,
                payload: msg
            })
        })
        return () => socket.close('addMessageToClient')
    },[socket, dispatch])


    // Check User Online 
    useEffect(() => {
        socket.emit('checkUserOnline', auth.user)
    },[socket, auth.user])


    useEffect(() => {
        socket.on('checkUserOnlineToMe', data => {
            data.forEach(item => {
                if(!online.includes(item.id)) {
                    dispatch({
                        type: globalTypes.ONLINE,
                        payload: item.id
                    })
                }
            })
        })
        return () => socket.close('checkUserOnlineToMe')
    },[socket, dispatch, online])


    useEffect(() => {
        socket.on('checkUserOnlineToClient',id => {
            if(!online.includes(id)) {
                dispatch({type: globalTypes.ONLINE, payload: id})
            }
        })
        return () => socket.close('checkUserOnlineToClient')
    },[socket, dispatch, online])


    // Check User Offline
    useEffect(() => {
        socket.on('checkUserOffline', id => {
            dispatch({
                type: globalTypes.OFFLINE,
                payload: id
            })
        })
        return () => socket.close('checkUserOffline')
    },[socket, dispatch])


    // Call User
    useEffect(() => {
        socket.on('callUserToClient', data => {
            dispatch({ type: globalTypes.CALL, payload: data })
        })  
        return () => socket.close('callUserToClient')
    },[socket, dispatch])


    // End Call
    useEffect(() => {
        socket.on('endCallToClient', data => {
    
            dispatch({ type: globalTypes.CALL, payload: null })
        })  
        return () => socket.off('endCallToClient')
    },[socket, dispatch])


    // User busy
    useEffect(() => {
        socket.on('userBusy', data => {
    
            dispatch({ type: globalTypes.ALERT, payload: {error: `user is busy!`} })
        })  
        return () => socket.off('userBusy')
    },[socket, dispatch])


    return ( 
        <>
            <audio controls ref={audioRef} style={{display: 'none'}}>
                <source src={audioBell} type="audio/mp3" />
            </audio>
        </>
    )
}

export default SocketClient
