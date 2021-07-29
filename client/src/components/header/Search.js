import axios, { getDataApi } from '../../utils/axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { globalTypes } from '../../redux/actions/constant';
import UserCard from '../card/UserCard';

const Search = () => {

    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);

    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        if (search) {
            getDataApi(`user?username=${search}`, auth.token)
                .then(res => {
                    setUsers(res.data.users)
                })
                .catch(err => {
                    console.log(err)
                    dispatch({
                        type: globalTypes.ALERT,
                        payload: {
                            error: err.response.data.msg
                        }
                    })
                })
        }else {
            setUsers([])
        }
    }, [search, auth.token])

    const handleClose = () => {
        setSearch('');
        setUsers([]);
    }

    return (
        <form className="search_form">
            <input
                type="text"
                name="search"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value.toLowerCase().replace(/ /g, ''))}
            />

            <div className="search_icon" style={{ opacity: search ? 0 : 0.3 }}>
                <span className="material-icons">
                    search
                </span>
                <span className="search">
                    Search
                </span>
            </div>

            <div
                className="close_search"
                style={{ opacity: !search || users.length === 0 ? 0 : 1 }}
                onClick={handleClose}
            >
                &times;
            </div>

            <div className="users">
                {
                    search && users.map(user => (
                        <UserCard
                            key={user._id}
                            user={user}
                            userId={user._id}
                            handleClose={handleClose}
                            border="border"
                        />
                    ))
                }
            </div>
        </form>
    )
}

export default Search
