import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { followUser, unFollowUser } from '../../redux/actions/profileAction'



const FollowBtn = ({ user }) => {
    
    const [followed, setFollowed] = useState(false)

    const { auth, socket } = useSelector(state => state);
    const dispatch = useDispatch();

    const [load, setLoad] = useState(false)

    useEffect(() => {
        if(auth.user.following.find(item => item._id === user._id)) {
            setFollowed(true)
        } else {
            setFollowed(false)
        }
    },[auth.user.following, user._id])


    const handleFollow = () => {
        if(load) return 

        setFollowed(true);
        setLoad(true)
        dispatch(followUser({user, auth, socket}))
        setLoad(false)
    }

    const handleUnFollow = () => {
        if(load) return
        
        setFollowed(false)
        setLoad(true)
        dispatch(unFollowUser({user, auth, socket}))
        setLoad(false)
    }

    return (
        <div>
            {
                followed ?
                <button 
                    className="btn btn-outline-danger" 
                    // style={{width: "230px"}}
                    onClick={handleUnFollow}
                >
                    UnFollow
                </button>
                :
                <button 
                    className="btn btn-outline-info" 
                    // style={{width: "230px"}}
                    onClick={handleFollow}
                >
                    Follow
                </button>
            }
        </div>
    )
}

export default FollowBtn
