import React, { useEffect, useState } from 'react'
import { globalTypes } from '../../redux/actions/constant';
import { getDataApi } from '../../utils/axios'
import LoadIcon from '../../images/loading.gif'
import PostThumb from '../PostThumb';


const Saved = ({ auth, dispatch }) => {

    const [savedPost, setSavedPost] = useState([]);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true)
        getDataApi(`saved_post`, auth.token)
        .then(res => {
            setSavedPost(res.data.post)
            setLoad(false)
        })
        .catch(err => {
            dispatch({
                type: globalTypes.ALERT,
                payload: { error: err.response.data.msg }
            })
        })
    },[auth, dispatch])

    return (
        <div>
            {   
                load 
                ? <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
                :<PostThumb posts={savedPost} />
            }
        </div>
    )
}

export default Saved
