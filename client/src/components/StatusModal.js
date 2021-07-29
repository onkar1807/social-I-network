import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { globalTypes } from '../redux/actions/constant';
import { createPost, updatePost } from '../redux/actions/postAction';
import { showImages, showVideos } from '../utils/medisShow';
import Icon from './Icon';

const StatusModal = () => {

    const { auth, theme, status, socket } = useSelector(state => state);
    const dispatch = useDispatch();

    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [stream, setStream] = useState(false);

    const videoRef = useRef()
    const canvasRef = useRef()
    const [tracks, setTracks] = useState('')

    const handleImageChange = (e) => {
        const files = [...e.target.files]
        let err = ""
        let newImages = []

        files.forEach(file => {
            if (!file) return err = "File does not exist."

            if (file.size > 1024 * 1024 * 5){
                return err = "Largest Image/Video size is 5mb"
            }

            return newImages.push(file)
        })

        if (err) {
            dispatch({
                type: globalTypes.ALERT,
                payload: { error: err }
            })
        }

       
        setImages([...images, ...newImages])
    }

    const deleteImage = (idx) => {
        const newArray = [...images]
        newArray.splice(idx, 1)
        setImages(newArray)
    }

    const handleStream = () => {
        setStream(true)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStraem => {
                    videoRef.current.srcObject = mediaStraem
                    videoRef.current.play()
                    const tracks = mediaStraem.getTracks()
                    // console.log(tracks);
                    setTracks(tracks[0])
                })
                .catch(err => console.log(err))
        }
    }

    const handleCapture = () => {
        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;

        canvasRef.current.setAttribute("width", width);
        canvasRef.current.setAttribute("height", height);

        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, width, height)
        let URL = canvasRef.current.toDataURL()
        setImages([...images, {camera: URL}])
    }

    const handleStopStream = () => {
        tracks.stop()
        setStream(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(images.length === 0) {
            return dispatch({
                type: globalTypes.ALERT,
                payload: {error: "Please add photos."}
            })
        }

        if(status.onEdit) {
            dispatch(updatePost({content, images, auth, status}));
        } else {
            dispatch(createPost({content, images, auth, socket}));
        }
    
        setContent('')
        setImages([])
        if(tracks) tracks.stop()
        dispatch({type: globalTypes.STATUS, payload: false})
    }

    useEffect(() => {
        if(status.onEdit) {
            setContent(status.content)
            setImages(status.images)
        }
    }, [status])



    

    return (
        <div className="status-modal">
            <form onSubmit={handleSubmit}>
                <div className="status_header">
                    <h5 className="m-0">Create Post</h5>
                    <span
                        onClick={() => dispatch({ type: globalTypes.STATUS, payload: false })}
                    >
                        &times;
                    </span>
                </div>

                <div className="status_body">
                    <textarea
                        value={content}
                        placeholder={`${auth.user.username}, what are you thinking?`}
                        onChange={(e) => setContent(e.target.value)}
                        style={{
                            filter: theme ? 'invert(1)' : 'invert(0)',
                            color: theme ? 'white' : '#111',
                            background: theme ? 'rgba(0,0,0,0.3)' : ''
                            }}
                    />

                    <div className="d-flex">
                        <div className="flex-fill"></div>
                        <Icon setContent={setContent} content={content} theme={theme} />
                    </div>

                    <div className="show_images">
                        {
                            images?.map((img, idx) => (
                                <div key={idx} id="file_img">
                                    {
                                        img.camera ? showImages(img.camera, theme)
                                        : img.url
                                            ? <>
                                                {
                                                    img.url.match(/video/i)
                                                    ? showVideos(img.url, theme) 
                                                    : showImages(img.url, theme)
                                                }
                                            </>
                                            :<>
                                                {
                                                    img.type.match(/video/i)
                                                    ? showVideos(URL.createObjectURL(img), theme) 
                                                    : showImages(URL.createObjectURL(img), theme)
                                                }
                                            </>
                                    }
                                    <span onClick={() => deleteImage(idx)}>&times;</span>
                                </div>
                            ))
                        }
                    </div>

                    {
                        stream &&
                        <div className="stream position-relative">
                            <video
                                ref={videoRef}
                                width="100%"
                                height="100%"
                                autoPlay
                                muted
                                style={{ filter: `${theme ? `invert(1)` : `invert(0)`}` }}
                            />
                            <span onClick={handleStopStream}>&times;</span>
                            <canvas ref={canvasRef} style={{display: "none"}} />
                        </div>
                    }

                    <div className="input_image">
                        {
                            stream
                                ? <i className="fas fa-camera" onClick={handleCapture} />
                                :
                                <>
                                    <i className="fas fa-camera" onClick={handleStream} />

                                    <div className="file_upload">
                                        <i className="fas fa-image" />
                                        <input
                                            type="file"
                                            name="file"
                                            id="file"
                                            multiple accept="image/*, video/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </>
                        }
                    </div>
                </div>

                <div className="status_footer">
                    <button
                        className="btn btn-secondary w-100"
                        type="submit"
                    >
                        {status.onEdit ? 'Update' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default StatusModal
