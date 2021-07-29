import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserCard from '../card/UserCard';
import LoadIcon from '../../images/loading.gif'
import FollowBtn from '../profile/FollowBtn'
import { getUserSuggestions } from '../../redux/actions/suggestionsAction';

const RightSideBar = () => {

    const { auth, suggestions } = useSelector(state => state);
    const dispatch = useDispatch();

    return (
        <div className="my-2">
            <UserCard user={auth.user} />

            <div className="d-flex justify-content-between align-items-center my-2 px-2 bg-light">
                <h5 className="text-danger">Suggestions for you</h5>
                {
                    !suggestions.loading &&
                    <i 
                        className="fas fa-redo" 
                        style={{cursor: 'pointer'}} 
                        onClick={ ()=>dispatch(getUserSuggestions(auth.token)) }
                    />
                }
                
            </div>

            {
                suggestions.loading
                ? <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
                : <div>
                    {
                        suggestions.users.map(user => (
                            <UserCard key={user._id} user={user}>
                                <FollowBtn user={user}/>
                            </UserCard>
                        )) 
                    }
                </div>
            }

            <div className="my-2" style={{opacity: '0.5'}}>
                <small>
                    &copy; 2021 I_NETWORK FROM ONKAR@533
                </small>
            </div>
        </div>
    )
}

export default RightSideBar
