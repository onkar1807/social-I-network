import { combineReducers } from 'redux'
import { authReducer } from './authReducer'
import { alertReducer } from './alertReducer'
import { themeReducer } from './themeReducer'
import { profileReducer } from './profileReducer'
import { statusReducer } from './statusReducer'
import { postReducer } from './postReducer'
import { modalReducer } from './modalReducer'
import { detailPostReducer } from './detailPostReduce'
import { discoverReducer } from './discoverReducer'
import { suggestionReducer } from './suggestionReducer'
import { socketReducer } from './socketReducer'
import { notifyReducer } from './notifyReducer'
import { messageReducer } from './messageReducer'
import { onlineReducer } from './onlineReducer'
import { callReducer } from './callReducer'
import { peerReducer } from './peerReducer'

export default combineReducers({
    auth: authReducer,
    alert: alertReducer,
    theme: themeReducer,
    profile: profileReducer,
    status: statusReducer,
    homePost: postReducer,
    modal: modalReducer,
    detailPost: detailPostReducer,
    discover: discoverReducer,
    suggestions: suggestionReducer,
    socket: socketReducer,
    notify: notifyReducer,
    message: messageReducer,
    online: onlineReducer,
    call: callReducer,
    peer: peerReducer
})