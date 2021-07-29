import { patchDataApi, postDataApi, deleteDataApi } from "../../utils/axios"
import { EditData, globalTypes, postTypes } from "./constant"
import { createNotify, removeNotify } from "./notifyAction"


export const createComment = ({ newComment, post, auth, socket }) => async (dispatch) => {
    const newPost = {...post, comments: [...post.comments, newComment]}
    
    dispatch({
        type: postTypes.UPDATE_POST,
        payload: newPost
    })

    try {
        const data = {
            ...newComment,
            postId: post._id,
            postUserId: post.postBy._id
        }

        const res = await postDataApi('comment', data, auth.token);
    
        const newData = {...res.data.comment, user: auth.user}
        const newPost = {...post, comments: [...post.comments, newData]}

        dispatch({
            type: postTypes.UPDATE_POST,
            payload: newPost
        })

        // Socket
        socket.emit('createComment', newPost);

         // Notify
         const notify = {
            id: res.data.comment._id,
            text: newComment.reply ? 'mentioned you in comment' : 'has commented on your post',
            recipients: newComment.reply ? [newComment.tag._id] : [post.postBy._id],
            url: `/post/${post._id}`,
            content: post.content,
            image: post.images[0].url
        }

        dispatch(createNotify({notify, auth, socket}))
        
    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: {error: error.response.data.msg}
        })
    }
}


export const updateComment = ({ post, comment,  content, auth }) => async (dispatch) => {

    let newComments = EditData(post.comments, comment._id, {...comment, content})
    let newPost = {...post, comments: newComments}
    
    dispatch({
        type: postTypes.UPDATE_POST,
        payload: newPost
    })

    try {
        const res = await patchDataApi(`comment/${comment._id}/update`, { content }, auth.token);

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: {error: error.response.data.msg}
        })
    }
}


export const likeComment = ({ comment, post, auth }) => async (dispatch) => {

    let newData  = {...comment, likes: [...comment.likes, auth.user]}
    let newPost = {...post, comments: EditData(post.comments, comment._id, newData)}
    
    dispatch({
        type: postTypes.UPDATE_POST,
        payload: newPost
    })

    try {
        const res = await patchDataApi(`comment/${comment._id}/like`, null, auth.token);

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: {error: error.response.data.msg}
        })
    }
}
 

export const dislikeComment = ({ comment, post, auth }) => async (dispatch) => {

   let newData = {...comment, likes: comment.likes.filter(like => like._id !== auth.user._id)}
   let newPost = {...post, comments: EditData(post.comments, comment._id, newData)}
    
    dispatch({
        type: postTypes.UPDATE_POST,
        payload: newPost
    })

    try {
        const res = await patchDataApi(`comment/${comment._id}/dislike`, null, auth.token);

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: {error: error.response.data.msg}
        })
    }
}


export const deleteComment = ({post, comment, auth, socket}) => async (dispatch) => {
    const deleteArr = [...post.comments.filter(cm => cm.reply === comment._id), comment]

    const newPost = {
        ...post,
        comments: post.comments.filter(cm => !deleteArr.find(dm => cm._id === dm._id))
    }
    
    dispatch({
        type: postTypes.UPDATE_POST,
        payload: newPost
    })

    // socket
    socket.emit('deleteComment', newPost)

    try {
        
        deleteArr.forEach(item => {
            deleteDataApi(`comment/${item._id}`, auth.token)

            // Notify
            const notify = {
                id: item._id,
                text: comment.reply ? 'mentioned you in comment' : 'has commented on your post',
                recipients: comment.reply ? [comment.tag._id] : [post.postBy._id],
                url: `/post/${post._id}`,
            }

            dispatch(removeNotify({notify, auth, socket}))
        })


    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: {error: error.response.data.msg}
        })
    }
}