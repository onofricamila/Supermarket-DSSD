// TODO no redireccionaba cuando te logueabas ... hice eso de toggle state redirect

import React, {Component} from 'react';
import './login.css';
import {AuthContext} from '../../App'
import {Redirect} from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios'

class Login extends Component {

    constructor(props){
      super(props);
      this.state = {
        credentials: {
            email:'',
            password:'',
        },
        msj:'Ingresa tus credenciales!'
      }
    }

    canSubmit(){
        let credentials = this.state.credentials
        if (credentials.email == '' || credentials.password == '') {
            return false
        } 
        return true
    }

    submit = () => {
        if (!this.canSubmit()) return false
        
        var self = this;
        let credentials = this.state.credentials
        axios.get(`http://localhost:3000/api/employees?filter=[{"field":"email","value":"${credentials.email}"},{"field":"password","value":"${credentials.password}"}]`)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                credentials: credentials,
                msj: 'Malas credenciales!'
            })
          });


        //this.props.onLogin()
        // aca seteaba redirec true
    }
    
    handleChange = name => event => {
        let currentState = this.state
        let currentCredentials = this.state.credentials
        this.setState({
          ...currentState,
          credentials: {
              ...currentCredentials,
              [name]: event.target.value,
          }
        })
    }

    render() {
        return (
            // aca hacia un if state redirec true entonces return Redicrect push to /
            <AuthContext.Consumer>
                {auth => auth ? "Ya estas logueado!" :  <div className="login-page">
                    <div className="form">
                        <p>{this.state.msj}</p>
                        <Form className="login-form">
                            <Input type="text" placeholder="Correo electrónico"  onChange={this.handleChange('email')}/>
                            <Input type="password" placeholder="Contraseña" onChange={this.handleChange('password')} />
                            <Button onClick={this.submit}>Iniciar sesión</Button>
                        </Form>
                    </div>
                </div>
                }
            </AuthContext.Consumer>
        );
    }
}

// https://codepen.io/colorlib/pen/rxddKy

export default Login;