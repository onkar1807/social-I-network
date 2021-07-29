import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/header/Header'
import Info from '../components/profile/Info'
import Post from '../components/profile/Post'
import LoadIcon from '../images/loading.gif'
import { useParams } from 'react-router-dom'
import { getProfileById } from '../redux/actions/profileAction'
import Saved from '../components/profile/Saved'


const Profile = () => {

    const { auth, profile } = useSelector(state => state);
    const dispatch = useDispatch();
    const { userId } = useParams();

    const [svaeTab, setSvaeTab] = useState(false);

    useEffect(() => {
        if(profile.ids.every(item => item !== userId)) {
            dispatch(getProfileById({users: profile.users, userId, auth}))
        }
    },[userId, auth, profile.users, dispatch, profile.ids])

    
    return (
        <Header>
            <div className="profile">
                {
                    profile.loading 
                    ?<img className="d-block mx-auto my-4" src={LoadIcon} alt="loading" />
                    : <Info auth={auth} profile={profile} dispatch={dispatch} userId={userId} />
                } 

                {
                    auth.user?._id === userId &&
                    <div className="profile_tab">
                        <button className={svaeTab ? '' : 'active'} onClick={()=>setSvaeTab(false)}>Posts</button>
                        <button className={svaeTab ? 'active' : ''} onClick={()=>setSvaeTab(true)}>Saved</button>
                    </div>
                }

                {   
                    profile.loading 
                    ? <img className="d-block mx-auto my-4" src={LoadIcon} alt="loading" />
                    : 
                    <>
                        { 
                            svaeTab
                            ? <Saved auth={auth} dispatch={dispatch}/>
                            : <Post auth={auth} profile={profile} dispatch={dispatch} userId={userId} />
                        }
                    </>
                }
            </div>
        </Header>
    )
}

export default Profile


                