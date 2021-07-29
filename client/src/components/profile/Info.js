import React, { useEffect, useState } from 'react';
import { globalTypes } from '../../redux/actions/constant';
import Avatar from '../Avatar';
import EditProfile from './EditProfile';
import FollowBtn from './FollowBtn';
import Followers from './Followers';
import Following from './Following';

const Info = ({auth, profile, dispatch, userId}) => {

    const [onEdit, setOnEdit] = useState(false);
    const [userData, setUserData] = useState([]);

    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
        
    useEffect(() => {
        if(userId === auth.user?._id) {
            setUserData([auth.user])
        }else {
            const newData = profile.users.filter(user => user._id === userId)
            setUserData(newData)    
        }
    }, [auth, profile.users, dispatch, userId])
    
    // useEffect(() => {
    //     if(onEdit) {
    //         dispatch({ type: globalTypes.MODAL, payload: true })
    //     } else {
    //         dispatch({ type: globalTypes.MODAL, payload: false })
    //     }
    // }, [onEdit])
    

    return (
        <div className="info">
           {
                userData && userData.map(user => (
                    <div className="info_container" key={user._id}>
                        <Avatar
                            src={user?.avatar}
                            size="super_avatar"
                        />
                        <div className="info_content">

                            <div className="info-content_title">
                                <h2>{user.username}</h2>

                                {
                                    user._id === auth.user._id
                                    ?<button 
                                        className="btn btn-outline-info"
                                        onClick={()=>setOnEdit(true)}
                                        >
                                            Edit Profile
                                    </button>
                                    :
                                    <FollowBtn 
                                        user={user}
                                    />
                                }
                               
                            </div>

                            <div className="follow_info mb-2">
                                <span className="mr" onClick={()=>setShowFollowers(!showFollowers)}>
                                    {user.followers?.length} Followers
                                </span>{" "}
                                <span className="ml" onClick={()=>setShowFollowing(!showFollowing)}>
                                    {user.following?.length} following
                                </span>
                            </div>

                            <h6>
                                {user.fullname} {" "} 
                                <span className="text-danger">{user.mobile}</span>
                            </h6>
                            <p className="m-0">{user.address}</p>
                            <h6 className="m-0">{user.email}</h6>
                            <a href={user.website} target="_blanc" rel="noreferrer">
                                {user.website}
                            </a>
                            <p>{user.story}</p>

                        </div>

                        {
                            onEdit && 
                            <EditProfile setOnEdit={setOnEdit} />
                        }

                        {
                            showFollowers && 
                            <Followers
                                users={user.followers}
                                setShowFollowers={setShowFollowers}                                 
                            />
                        }

                        {
                            showFollowing && 
                            <Following
                                users={user.following}
                                setShowFollowing={setShowFollowing}                                     
                            />
                        }
                    </div>
                ))
           }
        </div>
    )
}

export default Info
