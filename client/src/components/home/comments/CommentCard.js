import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../Avatar'
import moment from 'moment'
import LikeBtn from '../../LikeBtn'
import { useSelector, useDispatch } from 'react-redux'
import CommentMenu from './CommentMenu'
import { updateComment, likeComment, dislikeComment } from '../../../redux/actions/commentAction'
import InputComment from '../InputComment'


const CommentCard = ({ children, comment, post, commentId }) => {

    const { auth, theme } = useSelector(state => state);
    const dispatch = useDispatch();

    const [content, setContent] = useState('');
    const [readMore, setReadMore] = useState(false);

    const [isLike, setIsLike] = useState(false);
    const [loadLike, setloadLike] = useState(false);

    const [onEdit, setOnEdit] = useState(false);

    const [onReply, setOnReply] = useState(false);

    useEffect(() => {
        setContent(comment.content)
        setOnReply(false)
        if(comment.likes.find(like => like._id === auth.user._id)) {
            setIsLike(true)
        }
    },[comment, comment.likes, auth.user])

    const handleLike = () => {
        if(loadLike) return;
        setIsLike(true)
        setloadLike(true)
        dispatch(likeComment({ comment, post, auth }))
        setloadLike(false)
    }

    const handleUnlike = () => {
        if(loadLike) return;
        setIsLike(false)
        setloadLike(true)
        dispatch(dislikeComment({ comment, post, auth }))
        setloadLike(false)
    }

    const handleUpdate = () => {
        if(comment.content !== content) {
            dispatch(updateComment({ post, comment, content, auth }))
            setOnEdit(false)
        } else {
            setOnEdit(false)
        }
    }

    const handleReply = () => {
        if(onReply) return setOnReply(false)
        setOnReply({...comment, commentId})
    }

    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
        pointerEvent: comment._id ? 'inherit' : 'none'
    }

    return (
        <div className="comment_card mt-2" style={styleCard}>
            <Link
                to={`profile/${comment.user._id}`}
                className="d-flex text-dark mb-1"
                style={{ textDecoration: 'none' }}
            >
                <Avatar
                    src={comment.user?.avatar}
                    size="small_avatar"
                />
                <h6 className="mx-1">{comment.user.username}</h6>
            </Link>

            <div className="comment_content">
                <div className="flex-fill" style={{
                    filter: theme ? 'invert(1)' : 'invert(0)',  
                    color: theme ? 'white' : '#111'}}
                >

                    {
                        onEdit
                            ? <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                            :
                            <div>
                            {
                                comment.tag && comment.tag._id !== comment.user._id &&
                                <Link to={`profile/${comment.tag._id}`} className="mr-1">
                                    @{comment.tag.userName}
                                </Link>
                            }
                                <span>
                                    {
                                        content.length < 100
                                            ? content
                                            : readMore ? content + ' ' : content.slice(0, 100) + '....'
                                    }
                                </span>

                                {
                                    content.length > 100 &&
                                    <span
                                        className="readMore"
                                        onClick={() => setReadMore(!readMore)}
                                    >
                                        {readMore ? 'Hide content' : 'Read more'}
                                    </span>
                                }
                            </div>
                    }

                    <div style={{ cursor: 'pointer' }}>
                        <small className="text-muted mr-3">
                            {moment(content.createdAt).fromNow()}
                        </small>

                        <small className="font-weight-bold mr-3">
                            {
                                comment.likes.length === 0
                                    ? `0 like`
                                    : comment.likes.length > 1 
                                        ? <span>{comment.likes.length} likes</span> 
                                        : <span>{comment.likes.length} like</span>
                            }
                        </small>

                        {
                            onEdit
                            ?
                            <>
                                <small 
                                    className="font-weight-bold mr-3"
                                    onClick={handleUpdate}
                                >
                                    update
                                </small>
                                <small 
                                    className="font-weight-bold mr-3" 
                                    onClick={()=>setOnEdit(false)}
                                >
                                    cancel
                                </small>
                            </>
                            :
                                <small 
                                    className="font-weight-bold mr-3"
                                    onClick={handleReply}
                                >
                                    {onReply ? 'cancel' : 'reply'}
                                </small>
                        }
                    </div>
                </div>

                <div
                    className="d-flex align-items-center mx-2"
                    style={{ cursor: 'pointer' }}
                >
                    <CommentMenu
                        post={post}
                        comment={comment}
                        auth={auth}
                        setOnEdit={setOnEdit}
                    />

                    <LikeBtn
                        isLike={isLike}
                        handleLike={handleLike}
                        handleUnlike={handleUnlike}
                    />

                </div>
            </div>

            {
                onReply &&
                <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
                    <Link to={`profile/${onReply.user._id}`} className="mr-1">
                        @{onReply.user.username}:
                    </Link>
                </InputComment>
               
            }
            { children }
        </div>
    )
}

export default CommentCard
