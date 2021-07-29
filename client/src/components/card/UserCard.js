import React from 'react'
import Avatar from '../Avatar'
import { Link } from 'react-router-dom';

const UserCard = ({ children, theme, user, userId, border, handleClose, setShowFollowers , setShowFollowing, msg}) => {

    const handleCloseAll = () => {
        if(handleClose) handleClose()
        if(setShowFollowers) setShowFollowers(false)
        if(setShowFollowing) setShowFollowing(false)
    }
    return (
        <div 
            key={userId}
            className={`d-flex p-2 align-items-center justify-content-between mb-2 children && w-100 ${border}`}
           
        >
            <Link 
                to={`/profile/${user._id}`}
                className="d-flex align-items-center"
                style={{textDecoration: 'none', color: 'black'}}
                onClick={handleCloseAll}
            >
                <Avatar
                    src={user.avatar}
                    size="big_avatar"
                />
                <div style={{ marginLeft: '10px' }}>
                    <strong className="d-block">{user.username}</strong>
                    <small style={{ 
                        opacity: '0.7', filter: theme ? 'invert(1)' : 'invert(0)',
                        color: theme && 'white'
                        }}>
                            {
                                msg
                                ? <>
                                    <div>{ user?.text}</div>
                                    {
                                        user?.media.length > 0 &&
                                        <div>
                                            {user.media.length} <i className="fas fa-image" />
                                        </div>
                                    }
                                </>
                                : user.fullname
                            }
                    </small>
                </div>
            </Link>
            {children}
        </div>
    )
}

export default UserCard
