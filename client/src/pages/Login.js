import { useState } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../redux/actions/authAction';

const Login = () => {

    const initialState = { email: '', password: '' }
    const [userData, setUserData] = useState(initialState);
    const { email, password } = userData
    const [typePass, setTypePass] = useState(false)

    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const handleCHange = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(userData))
    }
    
    // if(auth.token) {
    //     return <Redirect to={"/"} />
    // }

    return (
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mt-4 mb-4">I-Network</h3>

                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        value={email}
                        name="email"
                        onChange={handleCHange}
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
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
                        />
                        <small onClick={()=>setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        </small>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-dark w-100 mt-4"
                    disabled={!email || !password}
                >
                    Login
                        </button>

                <p className="my-2">
                    You don't have an account?{" "}
                    <Link to="/register" style={{ textDecoration: 'none', color: 'crimson' }}>Register now</Link>
                </p>
            </form>

        </div>
    )
}

export default Login
