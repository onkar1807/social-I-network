export const showImages = (src, theme) => {
    return (
        <img 
            src={src} 
            alt="images" 
            className="img-thumbnail"
            style={{ filter: `${theme ? `invert(1)` : `invert(0)`}` }}
        />
    )
}

export const showVideos = (src, theme) => {
    return (
        <video 
            controls 
            src={src} 
            alt="video" 
            className="img-thumbnail"
            style={{ filter: `${theme ? `invert(1)` : `invert(0)`}` }}     
        />
    )
}