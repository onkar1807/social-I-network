import React, { useState, useEffect } from 'react'
import Header from '../components/header/Header'
import { useSelector, useDispatch } from 'react-redux'
import { getDiscoverPost } from '../redux/actions/discoverAction';
import LoadIcon from '../images/loading.gif'
import PostThumb from '../components/PostThumb';
import LoadMoreBtn from '../components/LoadMoreBtn';
import { getDataApi } from '../utils/axios';


const Discover = () => {

    const { auth, discover } = useSelector(state => state);
    const dispatch = useDispatch();

    const [posts, setPosts] = useState([])
    const [load, setLoad] = useState(false)
    const [page, setPage] = useState(2)
    const [result, setResult] = useState(9)
    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     if(!discover.firstLoad) {
    //         dispatch(getDiscoverPost(auth.token))
    //     }
    // },[auth.token, dispatch, discover.firstLoad])

    useEffect(() => {
        retrievePost()
    },[auth.token])

    const retrievePost = async() => {
        setLoading(true)
        try {
            const res = await getDataApi(`post_discover`, auth.token)
            setPosts(res.data.posts)
            setResult(res.data.result)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataApi(`post_discover?&num=${page * 3}`, auth.token)
        setPosts(res.data.posts)
        setResult(res.data.result)
        setPage(page + 1)
        setLoad(false)
    }

    return (
        <Header>
            {
                loading 
                ? <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
                : <PostThumb posts={posts} result={result} />
            }

            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
            }

            <LoadMoreBtn 
                load={load} 
                result={result} 
                page={page} 
                handleLoadMore={handleLoadMore} 
            />
        </Header>
    )
}

export default Discover
