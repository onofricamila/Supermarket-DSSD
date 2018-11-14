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
        msj:'Ingresa tus credenciales!',
        redirect: false,
      }
    }

    canSubmit(){
       let credentials = this.state.credentials
       return (this.filledFields(credentials) && this.validEmail(credentials))
    }

    filledFields(credentials){
        if (credentials.email == '' || credentials.password == '') {
            this.setState({
                credentials: credentials,
                msj: 'Debes completar los campos!',
                redirect: false
            })
            return false
        } 
        return true
    }

    validEmail(credentials){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(credentials.email).toLowerCase())){
            return true
        }
        this.setState({
            credentials: credentials,
            msj: 'Debes ingresar un mail valido!',
            redirect: false
        })
        return false
    }

    submit = () => {
        if (!this.canSubmit()) return false
        
        var self = this;
        let credentials = this.state.credentials
        axios.get(`http://localhost:3000/api/employees?filter=[{"field":"email","value":"${credentials.email}"},{"field":"password","value":"${credentials.password}"}]`)
          .then(function (response) {
            console.log(response);
            if (response.data =! null) {
                self.setState({
                    redirect: true
                })
                self.props.onLogin()
            }
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                credentials: credentials,
                msj: 'Malas credenciales!',
                redirect: false
            })
          })  
            
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
        if (this.state.redirect == true)  return (<Redirect to='/' />) 
      
        return (
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

export default Login;