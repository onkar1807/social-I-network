import { BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { refreshToken } from './redux/actions/authAction';
import Alert from './components/notify/Alert';
import Profile from './pages/Profile';
import Message from './pages/message/Index';
import Discover from './pages/Discover';
import Notify from './pages/Notify';
import Conversation from './pages/message/Conversation';
import PrivateRoute from './customeRoute/PrivateRoute';
import StatusModal from './components/StatusModal';
import PostUserId from './pages/post/PostUserId';
import { getPost } from './redux/actions/postAction';
import { getUserSuggestions } from './redux/actions/suggestionsAction';

import io from "socket.io-client";
import { globalTypes } from './redux/actions/constant';
import SocketClient from './components/SocketClient';
import { getNotify } from './redux/actions/notifyAction';
import CallModal from './components/message/CallModal';

import Peer from 'peerjs'



function App() {

  const { auth, status, modal, socket, call } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken())

    const socket = io();
    dispatch({ type: globalTypes.SOCKET, payload: socket })
    return () => socket.close()
  },[dispatch])


  useEffect(() => {
    if(auth.token) {
      dispatch(getPost(auth.token))
      dispatch(getUserSuggestions(auth.token))
      dispatch(getNotify(auth.token, socket))
    }
  },[dispatch, auth.token, socket])



  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    else if (Notification.permission === "granted") {}
  
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        
        if (permission === "granted") {}
      });
    }
  },[])


  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
   
    dispatch({ type: globalTypes.PEER, payload: newPeer })
  },[dispatch])


  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className={`app ${(modal) && 'mode' }`}>
        <div className="main">
          
          <Route exact path="/" component={auth.token ? Home : Login} />
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}
          
          <Route exact path="/register" component={Register} />

          <PrivateRoute exact path="/profile/:userId" component={Profile} />
          <PrivateRoute exact path="/post/:id" component={PostUserId} />
          <PrivateRoute exact path="/message" component={Message} />
          <PrivateRoute exact path="/message/:id" component={Conversation} />
          <PrivateRoute exact path="/discover" component={Discover} />
          <PrivateRoute exact path="/notify" component={Notify} />
          
        </div>
      </div>
    </Router>
  );
}

export default App;
