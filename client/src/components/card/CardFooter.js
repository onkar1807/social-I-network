import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import send from '../../images/send.svg'
import { dislikePost, likePost, savePost, unSavePost } from '../../redux/actions/postAction';
import { BASE_URL } from '../../utils/url';
import LikeBtn from '../LikeBtn';
import ShareModal from '../ShareModal';

const CardFooter = ({ post }) => {

    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false);
    const [isShare, setIsShare] = useState(false);

    const [saved, setSaved] = useState(false)

    const { auth, theme, socket }  = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        if(post.likes.find(like => like._id === auth.user._id)) {
            setIsLike(true)
        }
    }, [post.likes, auth.user._id])

    const handleLike = async () => {
        if(loadLike) return;
        setIsLike(true)
        setLoadLike(true)
        await dispatch(likePost({ post, auth, socket }))
        setLoadLike(false)
    }

    const handleUnlike = async () => {
        if(loadLike) return;
        setIsLike(false)
        setLoadLike(true)
        await dispatch(dislikePost({ post, auth, socket }))
        setLoadLike(false)
    }

    useEffect(() => {
        if(auth.user.saved.find(id => id === post._id)) {
            setSaved(true)
        }else {
            setSaved(false)
        }
    },[auth.user, post._id])


    return (
        <div className="card_footer">
            <div className="card_icon_menu">
                <div>
                    <LikeBtn 
                        isLike={isLike} 
                        handleLike={handleLike}
                        handleUnlike={handleUnlike}
                    />
                    <Link to={`post/${post._id}`} className="text-dark">
                        <i className="far fa-comment" />
                    </Link>

                    <img src={send} alt="send" onClick={()=>setIsShare(!isShare)} />

                </div>
                {
                    saved 
                    ? <i className="fas fa-bookmark" onClick={()=>dispatch(unSavePost({post, auth}))}/>
                    : <i className="far fa-bookmark" onClick={()=>dispatch(savePost({post, auth}))} /> 
                }
            </div>

            <div className="d-flex justify-content-between">
                <h6 
                    style={{padding: '0 24px', cursor: 'pointer'}}
                >
                    {post.likes?.length} likes
                </h6>

                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                    {post.comments?.length} comments
                </h6>
            </div>

            {
                isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} theme={theme} />
            }
        </div>
    )
}

export default CardFooter
