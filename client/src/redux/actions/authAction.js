import axios, { postDataApi } from "../../utils/axios";
import valid from "../../utils/valid";
import { globalTypes } from "../actions/constant";

//-----------------LOGIN---------------------//
export const login = (data) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: globalTypes.ALERT,
                payload: {
                    loading: true
                }
            })

            const res = await axios.post('/login', data);
            // const res = await axios.post('/login', data);

            dispatch({
                type: globalTypes.AUTH,
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                }
            })

            localStorage.setItem("auth_token", res.data.access_token)
            localStorage.setItem("user", JSON.stringify(res.data.user))
            // localStorage.setItem("firstLogin", true)

            dispatch({
                type: globalTypes.ALERT,
                payload: {
                    success: res.data.msg
                }
            })
        } catch (error) {
            dispatch({
                type: globalTypes.ALERT,
                payload: {
                    error: error.response.data.msg
                }
            })
        }
    }
}


//-----------------REGISTER---------------------//
export const register = (data) => {
    return async (dispatch) => {

        const check = valid(data)
        if(check.errLength > 0) {
            dispatch({
                type: globalTypes.ALERT,
                payload: check.errMsg 
            })
        }

        try {
        
            dispatch({
                type: globalTypes.ALERT,
                payload: { loading: true } 
            })

            const res = await axios.post('/register', data);

            dispatch({
                type: globalTypes.AUTH,
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                }
            })

            dispatch({
                type: globalTypes.ALERT,
                payload: {
                    success: res.data.msg
                }
            })

        } catch (error) {
            dispatch({
                type: globalTypes.ALERT,
                payload: {
                    error: error.response.data.msg
                }
            })
        }
    }
}


//-----------------LOGOUT---------------------//
export const logout = () => async (dispatch) => {
    try {
        localStorage.clear()
        await axios.post('/logout')
        window.location.href = "/"
    } catch (error) {
        dispatch({
            type: globalTypes.ALERT,
            payload: {
                error: error.response.data.msg
            }
        })
    }
}


// -----------------REFRESH TOKEN---------------------//
export const refreshToken = () => {
    return async (dispatch) => {
        const token = localStorage.getItem('auth_token');
        if(token) {
            const user = JSON.parse(localStorage.getItem('user'));
            dispatch({
                type: globalTypes.AUTH,
                payload: { 
                    user, token
                }
            });
        } else {
            dispatch({
                type: globalTypes.ALERT,
                payload: { error: 'User needs to login' }
            })
        }
    }
}







// export const refreshToken = () => async (dispatch) => {
//     const firstLogin = localStorage.getItem("firstLogin")
//     if(firstLogin){
//         dispatch({ type: globalTypes.ALERT, payload: {loading: true} })

//         try {
//             const res = await axios.post('/refresh_token');
//             console.log(res);
//             dispatch({ 
//                 type: globalTypes.AUTH, 
//                 payload: {
//                     token: res.data.access_token,
//                     user: res.data.user
//                 } 
//             })

//             dispatch({ type: globalTypes.ALERT, payload: {loading: false} })

//         } catch (err) {
            
//             dispatch({ 
//                 type: globalTypes.ALERT, 
//                 payload: {
//                     error: err.response.data.msg
//                 } 
//             })
//         }
//     }
// }