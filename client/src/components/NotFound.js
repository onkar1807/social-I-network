import React from 'react'

const NotFound = () => {
    return (
        <div className="position-relative"  style={{ minHeight: 'calc(100vh - 70px)'}}>
            <h2 className="position-absolute text-secondary" 
                style={{left:'50%', top:'50%', transform: 'translate(-50%, -50%)'}}
            >
                404 | Not Found.
            </h2>
        </div>
    )
}

export default NotFound
