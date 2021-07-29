import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/header/Header'
import Post from '../components/home/Post'
import Status from '../components/home/Status'
import StatusModal from '../components/StatusModal'
import { getPost } from '../redux/actions/postAction'
import LoadIcon from '../images/loading.gif'
import RightSideBar from '../components/home/RightSideBar'

const Home = () => {

    const { auth, status, homePost } = useSelector(state => state)
    const dispatch = useDispatch();


    return (
        <Header>
           <div className="home row mx-0">
               <div className="col-md-8">

                    {status && <StatusModal />}

                   <Status />
                    {
                        homePost.loading 
                        ? <img className="d-block mx-auto my-4" src={LoadIcon} alt="loading" />
                        : homePost.result === 0 
                            ? <h2>No posts</h2>
                            :<Post />
                    }
                   
               </div>

               <div className="col-md-4">
                    <RightSideBar />
               </div>
           </div>
        </Header>
    )
}

export default Home
