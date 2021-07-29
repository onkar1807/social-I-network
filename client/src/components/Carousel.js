import React from 'react'
import { useSelector } from 'react-redux'
import Icon from './Icon'

const Carousel = ({ images, id }) => {

    const { theme } = useSelector(state => state)

    const isActive = (index) => {
        if(index === 0) return 'active'
    }

    return (
        <div id={`image${id}`} className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
                {
                    images.length > 1 && images.map((img, idx) => (
                        <li 
                            key={idx}
                            data-target={`#image${id}`} 
                            data-slide-to={idx} 
                            className={isActive(idx)} 
                        />
                    ))
                }
            </ol>

            <div className="carousel-inner">
                {
                    images.map((img, idx) => (
                        <div key={idx} className={`carousel-item ${isActive(idx)}`}>

                            {
                                img.url.match(/video/i)
                                ? <video
                                    controls 
                                    key={idx}
                                    className="d-block w-100" 
                                    src={img.url} 
                                    alt={img.url}
                                    style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                                />
                                : <img 
                                    key={idx}
                                    className="d-block w-100" 
                                    src={img.url} 
                                    alt={img.url}
                                    style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                                />
                            }
                           
                        </div>
                    ))
                }
            </div>

            { 
                images.length > 1 &&
                <>
                <a className="carousel-control-prev" href={`#image${id}`}  role="button" data-slide="prev"
                    style={{width:'5%'}}
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>

                <a className="carousel-control-next" href={`#image${id}`}  role="button" data-slide="next"
                    style={{width:'5%'}}>
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
                </>
            }
        </div>
    )
}

export default Carousel
