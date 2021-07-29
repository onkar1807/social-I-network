import React, { useEffect, useState } from 'react'
import PostThumb from '../PostThumb';


const Post = ({ auth, profile, userId, dispatch}) => {

    const [posts, setPosts] = useState([]);
    const [result, setResult] = useState(9)

    useEffect(() => {
        profile.posts.forEach(data => {
            if(data._id === userId) {
                setPosts(data.post)
                setResult(data.result)
            }
        })
    }, [profile.posts, userId])

   
    return (
        <div>
            <PostThumb posts={posts} result={result} />
        </div>
    )
}

export default Post
