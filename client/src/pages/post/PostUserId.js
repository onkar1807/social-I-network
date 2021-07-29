import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router'
import Header from '../../components/header/Header';
import { gePostById } from '../../redux/actions/postAction';
import LoadIcon from '../../images/loading.gif'
import PostCard from '../../components/PostCard';

const PostUserId = () => {

    const { auth, detailPost } = useSelector(state => state);
    const dispatch = useDispatch();

    const { id } = useParams();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        dispatch(gePostById({ detailPost, id, auth }))

        if(detailPost.length > 0 ) {
            const newArr = detailPost.filter(post => post._id === id);
            setPosts(newArr)
        }
    },[dispatch, id, auth, detailPost])

    return (
        <Header>
            <div className="posts">
                {
                    posts.length === 0 && 
                    <img src={LoadIcon} alt="LoadIcon" className="d-block mx-auto my-4" /> 
                }

                {
                    posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))
                }
            </div>
        </Header>
    )
}

export default PostUserId
