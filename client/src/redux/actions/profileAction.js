import { getDataApi, patchDataApi } from "../../utils/axios"
import { globalTypes, profileTypes } from "./constant"
import { uploadimage } from '../../utils/imageUpload'
import { createNotify, removeNotify } from "./notifyAction"


export const getProfileById = ({ users, userId, auth }) => {
    return async (dispatch) => {
        dispatch({
            type: profileTypes.GET_PROFILE_ID,
            payload: userId
        })

        try {
            dispatch({
                type: profileTypes.LOADING,
                payload: { loading: true }
            })

            const res = getDataApi(`user/${userId}`, auth.token);
            const res1 = getDataApi(`/user_posts/${userId}`, auth.token);

            const users = await res;
            const posts = await res1;

            dispatch({
                type: profileTypes.GET_USER,
                payload: { user: users.data.user }
            })

            dispatch({
                type: profileTypes.GET_USERS_POST,
                payload: {...posts.data, _id: userId, page: 2 }
            })

            dispatch({
                type: profileTypes.LOADING,
                payload: { loading: false }
            })

        } catch (error) {
            dispatch({
                type: globalTypes.ALERT,
                payload: { error: error.response.data.msg }
            })
        }
    }
}


export const updateUserProfile = ({ userData, avatar, auth }) => {
    return async (dispatch) => {
        // console.log({userData, avatar});

        if (!userData.fullname)
            return dispatch({ type: globalTypes.ALERT, payload: { error: "Please add your full name." } });

        if (userData.fullname.length > 25)
            return dispatch({ type: globalTypes.ALERT, payload: { error: "Your full name too long." } });

        if (userData.story.length > 200)
            return dispatch({ type: globalTypes.ALERT, payload: { error: "Your story too long." } });

        try {
            let media;
            dispatch({ type: globalTypes.ALERT, payload: { loading: true } });

            if (avatar) media = await uploadimage([avatar]);

            const res = await patchDataApi("user",
                {
                    userData,
                    avatar: avatar ? media[0].url : auth.user.avatar
                }, auth.token)

            localStorage.setItem("user", JSON.stringify(res.data.updateUser))

            dispatch({
                type: globalTypes.AUTH,
                payload: {
                    ...auth,
                    user: res.data.updateUser
 
                    // ...auth,
                    // user: {
                    //     ...auth.user, ...userData,
                    //     avatar: avatar ? media[0].url : auth.user.avatar
                    // }
                }
            })

            dispatch({ type: globalTypes.ALERT, payload: { success: res.data.msg } });
        } catch (error) {
            dispatch({
                type: globalTypes.ALERT,
                payload: { error: error.response.data.msg }
            })
        }
    }
}


export const followUser = ({ user, auth, socket }) => {
    return async (dispatch) => {

        let newUser = { ...user, followers: [...user.followers, auth.user] }
       

        dispatch({
            type: profileTypes.FOLLOW,
            payload: newUser
        })

        dispatch({
            type: globalTypes.AUTH,
            payload: {
                ...auth,
                user: { ...auth.user, following: [...auth.user.following, newUser] }
            }
        })

        const newAuthUser = { ...auth.user, following: [...auth.user.following, newUser] }
        localStorage.setItem("user", JSON.stringify(newAuthUser))

        try {
            const res = await patchDataApi(`user/${user._id}/follow`, null, auth.token)
        
            // socket 
            socket.emit('FollowUser', res.data.newUser);

            // Notify
            const notify = {
                id: auth.user._id,
                text: 'has started to follow you.',
                recipients: [newUser._id],
                url: `/profile/${auth.user._id}`,
            }

            dispatch(createNotify({notify, auth, socket}))

        } catch (error) {
            dispatch({
                type: globalTypes.ALERT,
                payload: { error: error.response.data.msg }
            })
        }

    }
}


export const unFollowUser = ({ user, auth, socket }) => {
    return async (dispatch) => {
        let newUser = { ...user, followers: user.followers.filter(item => item._id !== auth.user._id) }
        
        dispatch({
            type: profileTypes.UNFOLLOW,
            payload: newUser
        })

        dispatch({
            type: globalTypes.AUTH,
            payload: {
                ...auth,
                user: { ...auth.user, following: auth.user.following.filter(item => item._id !== newUser._id) }
            }
        })

        const newAuthUser =  { ...auth.user, following: auth.user.following.filter(item => item._id !== newUser._id) }
        localStorage.setItem("user", JSON.stringify(newAuthUser))


        try {
            const res = await patchDataApi(`user/${user._id}/unfollow`, null, auth.token);

            // socket 
            socket.emit('UnfollowUser',res.data.newUser);

            // Notify
            const notify = {
                id: auth.user._id,
                text: 'has started to follow you.',
                recipients: [newUser._id],
                url: `/profile/${auth.user._id}`,
            }

            dispatch(removeNotify({notify, auth, socket}))
        
        } catch (error) {
            dispatch({
                type: globalTypes.ALERT,
                payload: { error: error.response.data.msg }
            })
        }
    }
}

