import React from 'react';
import './header.css';

const header = props => (
    <div className="topnav">
        <a href="#home" className="header-supermarket-name">Supermarket - DSSD</a>
        <div className="search-container">
            <form action="/action_page.php">
                <input type="text" placeholder="Buscar..." name="search"/>
                <button type="submit"><i className="fa fa-search"></i></button>
            </form>
        </div>
        <div className="header-login">
            <a href="login" className="header-login-link">
                <img src="img/user-icon.png" alt="user icon" className="header-login-icon"/>
                Iniciar sesión
            </a>
        </div>
    </div>
);

export default header;