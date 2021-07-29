import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMessage } from '../../redux/actions/messageAction'
import { showImages, showVideos } from '../../utils/medisShow'
import Avatar from '../Avatar'
import Times from './Times'

const DisplayMessage = ({ user, msg, theme, data }) => {

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleDeleteMessage = () => {
        if(data) {
            dispatch(deleteMessage({data, auth, msg}))
        }
    }

    return (
        <>
            <div className="chat_title">
                <Avatar src={user?.avatar} size="small_avatar" />
                <span>{user?.username}</span>
            </div>

            <div className="your_content">

                {
                    auth.user._id === user._id &&
                    <i 
                        className="fas fa-trash text-danger" 
                        style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                        onClick={handleDeleteMessage}
                    />
                }

                <div>
                    {
                        msg.text && 
                        <div 
                            className="chat_text" 
                            style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                        >
                            {msg.text}
                        </div>
                    }

                    {
                        msg.media.map((item, idx) => (
                                <div key={idx}>
                                    {
                                        item.url.match(/video/i)
                                        ? showVideos(item.url, theme)
                                        : showImages(item.url, theme)
                                    }
                                </div>
                        ))
                    }
                </div>

                <div>
                    {
                        msg.call &&
                        <button 
                            className="btn d-flex align-items-center py-3"
                            style={{background: '#eee', borderRadius: '10px'}}
                        >
                            <span
                                className="material-icons font-weight-bold mr-1"
                                style={{
                                    fontSize: '2.2rem', color: msg.call.times === 0 ? 'crimson' : 'green',
                                    filter: theme ? 'invert(1)' : 'invert(0)'
                                }}
                            >   
                                {
                                    msg.call.times === 0
                                    ? msg.call.video ? 'videocam_off' : 'phone_disabled'
                                    : msg.call.video ? 'video_camera_front' : 'call'
                                }   
                            </span>

                            <div className="text-next">
                                <h6>{msg.call.video ? 'Video Call' : 'Audio Call'}</h6>
                                <small>
                                    {
                                        msg.call.times > 0
                                        ? <Times total={msg.call.times} />
                                        : new Date(msg.call.times).toLocaleString()
                                    }
                                </small>
                            </div>
                        </button>
                    }
                </div>
            </div>

            <div className="chat_time">
                {new Date(msg.createdAt).toLocaleString()}
            </div>
        </>
    )
}

export default DisplayMessage
