import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { register } from '../redux/actions/authAction'

const Register = ({ history }) => {

    const initialState = { fullname: '', username: '', email: '', password: '', cf_password: '', gender: 'male' }
    const [userData, setUserData] = useState(initialState);
    const { fullname, username, email, password, cf_password } = userData
    const [typePass, setTypePass] = useState(false)
    const [typeCf_Pass, setTypeCf_Pass] = useState(false)

    const {auth, alert} = useSelector(state => state)
    const dispatch = useDispatch()

    const handleCHange = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(userData))
    }

    // useEffect(() => {
    //     if(auth.token) history.push("/login")
    // }, [auth.token])

    return (
        <div className="auth_page register">
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mt-4 mb-4">I-Network</h3>

                <div className="form-group">
                    <label htmlFor="fullname">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fullname"
                        value={fullname}
                        name="fullname"
                        onChange={handleCHange}
                        style={{background: `${alert.fullname ? '#fd2d6a14' : '' }`}}
                    />
                    <small id="emailHelp" className="form-text text-danger">
                        {alert.fullname && alert.fullname}
                    </small>
                </div>

                <div className="form-group mt-2">
                    <label htmlFor="username">User Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username.toLowerCase().replace(/ /g, '')}
                        name="username"
                        onChange={handleCHange}
                        style={{background: `${alert.username ? '#fd2d6a14' : '' }`}}
                    />
                    <small id="emailHelp" className="form-text text-danger">
                        {alert.username && alert.username}
                    </small>
                </div>

                <div className="form-group mt-2">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        value={email}
                        name="email"
                        onChange={handleCHange}
                        style={{background: `${alert.email ? '#fd2d6a14' : '' }`}}
                    />
                    <small id="emailHelp" className="form-text text-danger">
                        {alert.email && alert.email}
                    </small>
                </div>

                <div className="form-group mt-2">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <div className="pass">
                        <input
                            type={typePass ? "text" : "password"}
                            className="form-control"
                            id="exampleInputPassword1"
                            value={password}
                            name="password"
                            onChange={handleCHange}
                            style={{background: `${alert.password ? '#fd2d6a14' : '' }`}}
                        />
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        </small>
                    </div>
                        <small className="form-text text-danger">
                            {alert.password && alert.password}
                        </small>
                </div>

                <div className="form-group mt-2">
                    <label htmlFor="cf_password">Confirm Password</label>
                    <div className="pass">
                        <input
                            type={typeCf_Pass ? "text" : "password"}
                            className="form-control"
                            id="cf_password"
                            value={cf_password}
                            name="cf_password"
                            onChange={handleCHange}
                            style={{background: `${alert.cf_password ? '#fd2d6a14' : '' }`}}
                        />
                        <small onClick={() => setTypeCf_Pass(!typeCf_Pass)}>
                            {typeCf_Pass ? 'Hide' : 'Show'}
                        </small>
                    </div>
                        <small className="form-text text-danger">
                            {alert.cf_password && alert.cf_password}
                        </small>
                </div>

                <div className="d-flex justify-content-between mx-0 mt-2">
                    <label htmlFor="male">
                        Male: <input
                                type="radio"
                                id="male"
                                name="gender"
                                value="male"
                                defaultChecked
                                onChange={handleCHange}
                            />
                    </label>
                    <label htmlFor="female">
                        Female: <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="female"
                                onChange={handleCHange}
                            />
                    </label>
                    <label htmlFor="other">
                        Other: <input
                                type="radio"
                                id="other"
                                name="gender"
                                value="other"
                                onChange={handleCHange}
                            />
                    </label>
                    
                </div>

                <button
                    type="submit"
                    className="btn btn-dark w-100 mt-2"
                >
                    Register
                </button>

                <p className="my-2">
                    Already have an account?{" "}
                    <Link to="/" style={{ textDecoration: 'none', color: 'crimson' }}>Login now</Link>
                </p>
            </form>

        </div>
    )
}

export default Register
