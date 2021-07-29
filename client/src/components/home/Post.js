import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import PostCard from '../PostCard'


const Post = () => {

    const { homePost, theme } = useSelector(state => state);

    return (
        <div className="posts">
            {
                homePost.posts?.map(post => (
                    <PostCard key={post._id} post={post} theme={theme} />
                ))
            }
        </div>
    )
}

export default Post
