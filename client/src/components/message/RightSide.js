import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router';
import UserCard from '../card/UserCard'
import DisplayMessage from './DisplayMessage';
import { globalTypes } from '../../redux/actions/constant';
import { showVideos, showImages } from '../../utils/medisShow'
import Icon from '../Icon'
import { uploadimage } from '../../utils/imageUpload';
import { addMessages, deleteConversation, getMessages } from '../../redux/actions/messageAction';
import LoadIcon from '../../images/loading.gif';



const RightSide = () => {

    const { auth, message, theme, socket, peer } = useSelector(state => state);
    const dispatch = useDispatch();

    const { id } = useParams();
    const [user, setUser] = useState([]);

    const [text, setText] = useState('');
    const [media, setMedia] = useState([]);
    const [loadMedia, setLoadMedia] = useState(false);

    const refDisplay = useRef()
    const pageEnd = useRef()

    const [data, setData] = useState([])
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(0)

    const history = useHistory()

    useEffect(() => {
        const newData = message.data.find(item => item._id === id)

        if(newData) {
            setData(newData.messages)
            setResult(newData.result)
            setPage(newData.page)
        }
    },[message.data, id])


    useEffect(() => {
        if(id && message.users.length > 0) {
            // setTimeout(() => {
            //     refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
            // },50)

            const newUser = message.users.find(user => user._id === id)
            if(newUser) setUser(newUser)
        }
    }, [message.users, id])


    const handleChangeMedia = (e) => {
        const files = [...e.target.files]
        let err = ""
        let newMedia = []

        files.forEach(file => {
            if (!file) return err = "File does not exist."

            if (file.size > 1024 * 1024 * 5){
                return err = "Largest Image/Video size is 5mb"
            }

            return newMedia.push(file)
        })

        if (err) {
            dispatch({
                type: globalTypes.ALERT,
                payload: { error: err }
            })
        }

       
        setMedia([...media, ...newMedia])
    }


    const handleDeleteMedia = (idx) => {
        let newMedia = [...media]
        newMedia.splice(idx, 1)
        setMedia(newMedia)
    }


    const submitMessage = async(e) => {
        e.preventDefault();
        if(!text.trim() && media.length === 0) return;
        setText('')
        setMedia([])
        setLoadMedia(true)

        let newArray = []
        if(media.length > 0) newArray = await uploadimage(media)

        const msg = {
            sender: auth.user._id,
            recipient: id,
            text,
            media: newArray,
            createdAt: new Date().toISOString()
        }
        setLoadMedia(false)

        await dispatch(addMessages({msg, auth, socket}))
        if(refDisplay.current) {
            refDisplay.current.refscrollIntoView({behavior: 'smooth', block: 'end'})
        }
    }

    
    useEffect(() => {
        const getMessagesData = async () => {
            if(message.data.every(item => item._id !== id)){
                await dispatch(getMessages({auth, id}))
                setTimeout(() => {
                    if(refDisplay.current) {
                        refDisplay.current.refscrollIntoView({behavior: 'smooth', block: 'end'})
                    }
                },50)
            }
        }
        getMessagesData()
    },[id, dispatch, auth, message.data])


    const handleDeleteConversation = () => {
        if(window.confirm('Do you want to delete?')) {
            dispatch(deleteConversation({auth, id}))
            return history.push('/message')
        }
    }


    // Call
    const Caller = ({video}) => {
        const { _id, avatar, username, fullname } = user

        const msg = {
            sender: auth.user._id,
            recipient: _id,
            avatar, username, fullname, video
        }
       
        dispatch({ type: globalTypes.CALL, payload: msg })
    }

    const callUser = ({video}) => {
        const { _id, avatar, username, fullname } = auth.user;

        const msg = {
            sender: _id,
            recipient: user._id,
            avatar, username, fullname, video
        }
       
        if(peer.open) msg.peerId = peer._id

        socket.emit('callUser', msg)

    }

    const handleAudioCall = () => {
        Caller({video: false})
        callUser({video: false})
    }

    const handleVideoCall = () => {
        Caller({video: true})
        callUser({video: true})
    }

    return (
        <>
            <div className="message_header pt-2" style={{cursor: 'pointer'}}>
                {
                    user.length !== 0 &&
                    <UserCard user={user}>
                        <div>
                            <i 
                                className="fas fa-phone-alt" 
                                style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                                onClick={handleAudioCall}
                            />
                            <i 
                                className="fas fa-video mx-3" 
                                style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                                onClick={handleVideoCall}
                            />
                            <i 
                                className="fas fa-trash text-danger" 
                                style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                                onClick={handleDeleteConversation}
                            />
                        </div>
                    </UserCard>
                }
            </div>

            <div 
                className="chat_container"
                style={{height: media.length > 0 ? 'calc(100% - 180px)' : ''}}
            >
                <div className="chat_display" ref={refDisplay}>
                    {/* <button style={{margintop: '-25px'}} ref={pageEnd}>
                        Load more
                    </button> */}
                    {
                        data.length === 0 &&
                        <div 
                            style={{position: 'absolute', top: '40%', left: '40%', color: '#ddd'}}
                        >
                            <h1>Start Chat</h1>
                        </div>
                    }
                    {
                        data.map((msg, idx) => (
                            <div key={idx}>
                                {
                                    msg.sender !== auth.user._id &&
                                    <div className="chat_row other_message">
                                        <DisplayMessage user={user} msg={msg} theme={theme} />
                                    </div>
                                }

                                {
                                    msg.sender === auth.user._id &&
                                    <div className="chat_row your_message">
                                        <DisplayMessage user={auth.user} msg={msg} theme={theme} data={data} />
                                    </div>
                                }
                            </div>
                        ))
                    }

                    {
                        loadMedia &&
                        <div className="chat_row your_message">
                            <img src={LoadIcon} alt="loading" />
                        </div>
                    }
                </div>
            </div>

            <div 
                className="show_media" 
                style={{display: media.length > 0 ? 'grid' : 'none'}}
            >
                {
                    media.map((item, idx) => (
                        <div key={idx} id="file_image">
                            {
                                item.type.match(/video/i)
                                ? showVideos(URL.createObjectURL(item), theme)
                                : showImages(URL.createObjectURL(item), theme)
                            }
                            <span 
                                onClick={() => handleDeleteMedia(idx)}
                            >
                                &times;
                            </span>
                        </div>
                    ))
                }
            </div>

            <form className="chat_input" onSubmit={submitMessage}>
                <input
                    type="text"
                    placeholder="Enter your message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{
                        filter: theme ? 'invert(1)' : 'invert(0)',
                        background: theme ? 'rgba(0,0,0,0.3)' : '',
                        color: theme ? 'white' : ''
                    }}
                />
                
                <Icon setContent={setText} content={text} theme={theme} />

                <div className="file_upload">
                    <i 
                        className="fas fa-image text-danger" 
                        style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                        />
                    <input 
                        type="file" 
                        name="file"   
                        id="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleChangeMedia}
                    />
                </div>

                <button 
                    type="submit"
                    className="material-icons"
                    disabled={(text || media.length > 0) ? false : true}
                >
                    near_me
                </button>
            </form>
        </>
    )
}

export default RightSide
