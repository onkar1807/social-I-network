import React from 'react'
import UserCard from '../card/UserCard'
import { useSelector } from 'react-redux'
import FollowBtn from './FollowBtn'

const Following = ({ users, setShowFollowing }) => {
    
    const { auth } = useSelector(state => state)

    return (
        <div className="follow">
            <div className="follow_box">
                <h5 className="text-center">Following</h5>
                <hr />

                {
                    users.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            setShowFollowing={setShowFollowing}
                        >
                            {
                                auth.user._id !== user._id && <FollowBtn user={user} />
                            }
                        </UserCard>
                    ))
                }

                <div 
                    className="close"
                    onClick={()=>setShowFollowing(false)}
                >
                    &times;
                </div>
            </div>
        </div>
    )
}

export default Following
