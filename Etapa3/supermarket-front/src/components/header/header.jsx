import React, {Component} from 'react';
import './header.css';
import {AuthContext} from '../../App';
import {NavLink} from 'react-router-dom'
import { Button } from 'reactstrap';
import { FaUsers } from 'react-icons/fa';

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            items: {
              inicio: { path: '/', text: 'Inicio' },
              login: { path: '/login', text: 'Ingresar' },
            },
        }
      }
    
    render() {
        let inicio = this.state.items.inicio
        let login = this.state.items.login
        return (
            <div className="topnav">
                <NavLink to={inicio.path} className="header-supermarket-name">Supermarket - DSSD</NavLink>
                <div className="header-login">
                <AuthContext.Consumer>
                    {auth => auth ?  <Button outline color="secondary" onClick={this.props.onLogout}>Logout</Button> :  <NavLink to={login.path} className="header-login-link">
                    <FaUsers size='1.5em'/> Iniciar sesión </NavLink>
                    }
                </AuthContext.Consumer>
                    
                </div>
            </div>
        );
    }
}

export default Header;