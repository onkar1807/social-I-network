import React from 'react'
import { Link } from 'react-router-dom'
import Menu from './Menu'
import Search from './Search'


const Header = (props) => {

    return (
        <>
            <div className="header bg-light">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid d-flex justify-content-between">

                        <Link className="nav" style={{textDecoration: 'none'}} to="/">
                            <h1 
                                className="navbar-brand text-uppercase"
                                onClick={()=>window.scrollTo({top: 0, behavior: 'smooth'})}
                            >
                                I-Network
                            </h1>
                        </Link>
                        
                        <Search />

                        <Menu />

                    </div>
                </nav>
            </div>
            {props.children}
        </>
    )
}

export default Header
