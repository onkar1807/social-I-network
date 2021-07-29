import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from "../../utils/axios"
import { uploadimage } from "../../utils/imageUpload"
import { globalTypes, postTypes } from "./constant"
import { createNotify, removeNotify } from "./notifyAction"


export const createPost = ({ content, images, auth, socket }) => async (dispatch) => {
    let media = []
    try {
        dispatch({
            type: globalTypes.ALERT,
            payload: { loading: true }
        })

        if (images.length > 0) media = await uploadimage(images);

        const res = await postDataApi('posts', {
            content,
            images: media
        }, auth.token)


        dispatch({
            type: postTypes.CREATE_POST,
            payload: { ...res.data.post, postBy: auth.user }
        })

        dispatch({
            type: globalTypes.ALERT,
            payload: {
                success: res.data.msg
            }
        })

        // Notify
        const notify = {
            id: res.data.post._id,
            text: 'added a new post.',
            recipients: res.data.post.postBy.followers,
            url: `/post/${res.data.post._id}`,
            content,
            image: media[0].url
        }

        dispatch(createNotify({notify, auth, socket}))

    } catch (error) {
        console.log(error.response.data.msg)
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        })
    }
}


export const getPost = (token) => async (dispatch) => {
    try {
        dispatch({ type: postTypes.LOADING_POST, payload: true })

        const res = await getDataApi('posts', token)
        const { posts, result } = res.data

        dispatch({
            type: postTypes.GET_POST,
            payload: {
                posts, result
            }
        })

        dispatch({ type: postTypes.LOADING_POST, payload: false })
    } catch (error) {
        // dispatch({
        //     type: globalTypes.ALERT,
        //     payload: {error: error.response.data.msg}
        // })
    }
}


export const updatePost = ({ content, images, auth, status }) => async (dispatch) => {
    let media = []
    const newImgUrl = images.filter(img => !img.url)
    const oldImgUrl = images.filter(img => img.url)
    // console.log({newImgUrl, oldImgUrl});

    if (status.content === content
        && newImgUrl.length === 0
        && oldImgUrl.length === status.images.length
    ) return;

    try {
        dispatch({
            type: globalTypes.ALERT,
            payload: { loading: true }
        })

        if (newImgUrl.length > 0) media = await uploadimage(newImgUrl);

        const res = await patchDataApi(`post/${status._id}`, {
            content,
            images: [...oldImgUrl, ...media]
        }, auth.token)

        dispatch({
            type: postTypes.UPDATE_POST,
            payload: res.data.newPost
        })

        dispatch({
            type: globalTypes.ALERT,
            payload: { success: res.data.msg }
        })

    } catch (error) {
        console.log(error.response.data.msg)
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        })
    }
}


export const likePost = ({ post, auth, socket }) => async (dispatch) => {
    let newPost = { ...post, likes: [...post.likes, auth.user] }

    dispatch({
        type: postTypes.UPDATE_POST,
        payload: newPost
    })


    try {
        const res = await patchDataApi(`post/${post._id}/like`, null, auth.token);

        // socket
        socket.emit('likePost', newPost)

        // Notify
        const notify = {
            id: auth.user._id,
            text: 'liked your post.',
            recipients: [post.postBy._id],
            url: `/post/${post._id}`,
            content: post.content,
            image: post.images[0].url
        }

        dispatch(createNotify({notify, auth, socket}))

        dispatch({
            type: globalTypes.success,
            payload: { success: res.data.msg }
        })

    } catch (error) {
        // console.log(error)
        // dispatch({
        //     type: globalTypes.ALERT,
        //     payload: { error: error.response.data.msg }
        // })
    }
}


export const dislikePost = ({ post, auth, socket }) => async (dispatch) => {
    let newPost = { ...post, likes: post.likes.filter(like => like._id !== auth.user._id) }

    dispatch({
        type: postTypes.UPDATE_POST,
        payload: newPost
    })

    try {
        const res = await patchDataApi(`post/${post._id}/dislike`, null, auth.token);
        socket.emit('unLikePost', newPost)

          // Notify
          const notify = {
            id: auth.user._id,
            text: 'liked your post.',
            recipients: [post.postBy._id],
            url: `/post/${post._id}`,
        }

        dispatch(removeNotify({notify, auth, socket}))

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        })
    }
}


export const gePostById = ({ detailPost, id, auth }) => async (dispatch) => {

    if (detailPost.every(post => post._id !== id)) {

        try {
            const res = await getDataApi(`post/${id}`, auth.token)

            dispatch({
                type: postTypes.GET_POST_BY_ID,
                payload: res.data.post
            })

        } catch (error) {
            dispatch({
                type: globalTypes.ALERT,
                payload: { error: error.response.data.msg }
            })
        }
    }
}


export const deletePost = ({ post, auth, socket }) => async (dispatch) => {

    dispatch({
        type: postTypes.DELETE_POST,
        payload: post
    })

    try {
        const res = await deleteDataApi(`post/${post._id}`, auth.token)
       
        // Notify
        const notify = {
            id: post._id,
            text: 'added a new post.',
            recipients: res.data.post.postBy.followers,
            url: `/post/${post._id}`,
        }

        dispatch(removeNotify({notify, auth, socket}))
       
    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        })
    }
}


export const savePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: [...auth.user.saved, post._id]}

    dispatch({
        type: globalTypes.AUTH,
        payload: {...auth, user: newUser}
    })

    localStorage.setItem("user", JSON.stringify(newUser))
    try {
        const res = await patchDataApi(`save_post/${post._id}`, null, auth.token);

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        }) 
    }
}


export const unSavePost = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== post._id)}

    dispatch({
        type: globalTypes.AUTH,
        payload: {...auth, user: newUser}
    })

    localStorage.setItem("user", JSON.stringify(newUser))
    try {
        const res = await patchDataApi(`unsave_post/${post._id}`, null, auth.token);

    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: { error: error.response.data.msg }
        }) 
    }
}

