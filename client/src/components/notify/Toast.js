import React from 'react'

const Toast = ({msg, handleShow, bgColor}) => {
    return (
        <div
            style={{top: "5px", right: "5px", minWidth: "200px", zIndex: 50}} 
            className={`toast show position-fixed text-light ${bgColor}`}
        >
            <div className={`toast-header text-light ${bgColor}`}>
                <strong className="mr-auto text-light">{msg.title}</strong>
                <button 
                    className="mb-1 close text-light"
                    data-dismiss="toast"
                    onClick={handleShow}
                    style={{outline: 'none'}}
                >
                    &times;
                </button>
            </div>
            <div className="toast-header">
                {msg.body}
            </div>
        </div>
    )
}

export default Toast
