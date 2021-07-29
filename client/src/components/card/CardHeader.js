import React from 'react'
import Avatar from '../Avatar'
import { Link ,useHistory } from 'react-router-dom'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { globalTypes } from '../../redux/actions/constant'
import { deletePost } from '../../redux/actions/postAction'
import { BASE_URL } from '../../utils/url'

const CardHeader = ({ post }) => {

    const { auth, socket }  = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleEditPost = () => {
        dispatch({ type: globalTypes.STATUS, payload: {...post, onEdit: true } })
    }

    const handleDeletePost = () => {
        if(window.confirm("Are you sure you want to delete this post?")) {
            dispatch(deletePost({post, auth, socket}))
            return history.push('/')
        }
    }

    const handleCopyPost = () => {
        navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`)
    }
   
    return (
        <div className="cardHeader">
            <div className="d-flex">
                <Avatar 
                    src={post.postBy?.avatar}
                    size="big_avatar" 
                />

                <div className="card_name">
                    <h6 className="m-0">
                        <Link 
                            to={`/profile/${post.postBy._id}`} 
                            className="text-dark"
                            style={{textDecoration: "none"}}
                        >
                            {post.postBy.username}
                        </Link>
                    </h6>
                    <small className="text-muted">
                        {moment(post.createdAt).fromNow()}
                    </small>
                </div>
            </div>

            <div className="nav-item dropdown">
                <span className="material-icons" id="moreLink" data-toggle="dropdown">
                    more_horiz
                </span>

                <div className="dropdown-menu">
                    {
                        auth.user?._id === post.postBy?._id &&
                        <>
                            <div className="dropdown-item" onClick={handleEditPost}>
                                <span 
                                    className="material-icons"
                                >
                                    create
                                </span> Edit Post 
                            </div>
                            <div className="dropdown-item" onClick={handleDeletePost}>
                                <span className="material-icons">
                                    delete_outline
                                </span> Remove Post
                            </div>
                        </>
                    }
                    <div className="dropdown-item" onClick={handleCopyPost}>
                        <span className="material-icons">
                            content_copy
                        </span> Copy Link
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardHeader
