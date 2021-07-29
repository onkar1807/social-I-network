import React from 'react'

const LoadMoreBtn = ({load, result, page, handleLoadMore }) => {
    return (
        <>  
            {
                result < 3 * (page - 1) ? '' :
                !load && 
                <button 
                    className="btn btn-dark load_more mx-auto d-block"
                    onClick={handleLoadMore}
                >
                    Load More
                </button>
            }
        </>
    )
}

export default LoadMoreBtn
