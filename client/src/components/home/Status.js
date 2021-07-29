import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { globalTypes } from '../../redux/actions/constant';
import Avatar from '../Avatar'

const Status = () => {

    const { auth, theme } = useSelector(state => state);
    const dispatch = useDispatch();

    return (
        <div className="status d-flex my-3">
            <Avatar
                src={auth.user?.avatar}
                size="big2_avatar"
                style={{filter: theme ? `invert(1)` : `invert(0)`}}
            />
            <button 
                className="status_btn flex-fill"
                onClick={()=> dispatch({type: globalTypes.STATUS, payload: true})}
                >
                <strong>{auth.user.username}</strong>, what are you thinking?
            </button>
        </div>
    )
}

export default Status
