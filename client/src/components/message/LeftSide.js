import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { globalTypes } from '../../redux/actions/constant';
import { addUser, getConversations, messageType } from '../../redux/actions/messageAction';
import { getDataApi } from '../../utils/axios';
import UserCard from '../card/UserCard';

const LeftSide = () => {

    const { auth, message, theme, online } = useSelector(state => state);
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);

    const history = useHistory();
    const { id } = useParams();


    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!search) return setUsers([]);

        try {
            const res = await getDataApi(`user?username=${search}`, auth.token)
            setUsers(res.data.users)

        } catch (error) {
            dispatch({
                type: globalTypes.ALERT,
                payload: {error: error.response.data.msg}
            })
        }
    }

    const handleAddUser= (user) => {
        setSearch('')
        setUsers([])
        dispatch(addUser({ user, message }))
        // dispatch({
        //     type: messageType.USER_ONLINE_OFFLINE,
        //     payload: online
        // })

        return history.push(`/message/${user._id}`)
    }

    const isActive = (user) => {
        if(id === user._id) return 'active';
        return ''
    }

    useEffect(() => {
        if(message.firstLoad) return;
        dispatch(getConversations({auth}))
    },[dispatch, message.firstLoad, auth])


    // Check User Online / Offline
    useEffect(() => {
        if(message.firstLoad){
            // dispatch({
            //     type: messageType.USER_ONLINE_OFFLINE,
            //     payload: online
            // })
        }
    },[online, message.firstLoad, dispatch])

    return (
        <>
            <form 
                className="message_header"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    value={search}
                    placeholder="Enter to search"
                    onChange={(e)=>setSearch(e.target.value.toLowerCase().replace(/ /g, ''))}
                />
                <button type="submit" style={{display: 'none'}}>Search</button>
            </form>

            <div className="header_chat_list">
                {
                    users.length !== 0
                    ? <>
                        {
                            users.map(user => (
                                <div 
                                    key={user._id} 
                                    className={`message_user ${isActive(user)}`}
                                    onClick={()=>handleAddUser(user)}
                                >
                                    <UserCard user={user} theme={theme} />
                                </div>
                            ))
                        }
                    </>
                    :<> 
                        {
                            message.users.map(user => (
                                <div 
                                    key={user._id} 
                                    className={`message_user ${isActive(user)}`}
                                    onClick={()=>handleAddUser(user)}
                                >
                                    <UserCard user={user} theme={theme} msg={true}>

                                        {
                                            user.online
                                            ? <i className="fas fa-circle text-success" />
                                            : auth.user.following.find(item => 
                                                item._id === user._id
                                            ) && <i className="fas fa-circle" />
                     
                                        }
                                        
                                    </UserCard>
                                </div>
                            ))
                        }
                    </>
                }
            </div>
        </>
    )
}

export default LeftSide
