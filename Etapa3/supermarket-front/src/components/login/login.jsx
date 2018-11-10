import React from 'react';
import './login.css';

const login = props => (
    <div class="login-page">
        <div class="form">
            <form class="login-form">
                <input type="text" placeholder="Correo electrónico" />
                <input type="password" placeholder="Contraseña" />
                <button>Iniciar sesión</button>
            </form>
        </div>
    </div>
);

// https://codepen.io/colorlib/pen/rxddKy

export default login;