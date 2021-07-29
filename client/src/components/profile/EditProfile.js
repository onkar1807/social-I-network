import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { globalTypes } from '../../redux/actions/constant';
import { updateUserProfile } from '../../redux/actions/profileAction';
import { checkImage } from '../../utils/imageUpload';

const EditProfile = ({ setOnEdit }) => {

    const initState = {
        fullname: '', mobile: '', address: '', website: '', gender: '', story: ''
    }

    const [userData, setUserData] = useState(initState);
    const [avatar, setAvatar] = useState('');
    const { fullname, mobile, address, website, gender, story } = userData

    const { auth, theme } = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        setUserData(auth.user)
    }, [auth.user])
 
    const changeAvatar = (e) => {
        
        const err = checkImage(e.target.files[0])
        if(err) {
            return dispatch({
                type: globalTypes.ALERT,
                payload: { error: err }
            })
        }

        setAvatar(e.target.files[0])
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserProfile({userData, avatar, auth}))
    }

    return (
        <div className="edit_profile">
            <button 
                className="btn btn-danger btn_close"
                onClick={()=>setOnEdit(false)}>
                Close
            </button>

            <form onSubmit={handleSubmit}>
                <div className="info_avatar">
                    <img 
                        src={avatar ? URL.createObjectURL(avatar) : auth.user?.avatar}
                        style={{filter: theme ? 'invert(1)' : 'invert(0)' }} 
                    />
                    <span>
                        <i className="fas fa-camera" />
                        <p>Change</p>
                        <input
                            type="file"
                            name="file"
                            id="file_up"
                            accept="image/*"
                            onChange={changeAvatar}
                        />
                    </span>
                </div>

                <div className="form_group">
                    <label htmlFor="fullname">Full Name</label>
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control"
                                id="fullname"
                                value={fullname}
                                name="fullname"
                                onChange={handleChange}
                            />
                            <small 
                                className="text-danger position-absolute"
                                style={{top: '50%', right: '5px', transform: 'translateY(-50%)'}}>
                                {fullname.length}/25
                            </small>
                        </div>
                </div>

                <div className="form_group">
                    <label htmlFor="mobile">Mobile</label>
                        <input
                        type="text"
                        name="mobile"
                        className="form-control"
                        value={mobile}
                        onChange={handleChange} />
                </div>

                <div className="form_group">
                    <label htmlFor="address">Address</label>
                        <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={address}
                        onChange={handleChange} />
                </div>

                <div className="form_group">
                    <label htmlFor="website">Website</label>
                        <input
                        type="text"
                        name="website"
                        className="form-control"
                        value={website}
                        onChange={handleChange} />
                </div>

                <div className="form_group">
                    <label htmlFor="story">Story</label>
                        <textarea
                        name="story"
                        className="form-control"
                        cols="30" rows="4"
                        value={story}
                        onChange={handleChange} 
                    />

                    <small 
                        className="text-danger d-block text-right"
                    >
                        {story.length}/200

                    </small>
                </div>

                <label htmlFor="gender">Gender</label>
                <div className="input-group-prepend px-0 mb-0">
                    <select
                        name="gender"
                        id="gender"
                        value={gender}
                        className="custom-select text-capitalize"
                        onChange={handleChange}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <button
                    className="btn btn-info w-100 mt-4"
                    type="submit"
                >
                    Save
                </button>
            </form>
        </div>
    )
}

export default EditProfile
