import React, {Component} from 'react';
import './login.css';
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
        msj:'¡Ingresa tus credenciales!',
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
                msj: '¡Debes completar los campos!',
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
            msj: '¡Debes ingresar un mail valido!',
        })
        return false
    }

    submit = () => {
        if (!this.canSubmit()) return false
        
        let currentState = this.state
        var self = this;
        let credentials = this.state.credentials
        let params = {
            email: credentials.email,
            pass: credentials.password
        }
        axios.post('http://localhost:3003/login', params)
          .then(function (response) {
            console.log(response);
            if (response.data.success) {
                self.props.onLogin(response.data.token)
                self.props.history.push('/')
            }else{
                self.setState({
                    ...currentState,
                    msj: '¡Malas credenciales!'
                })
            }
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                credentials: credentials,
                msj: 'Algo salio mal :(',
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
        return (
               <div className="login-page">
                    <div className="form">
                        <p>{this.state.msj}</p>
                        <Form className="login-form">
                            <Input type="text" placeholder="Correo electrónico"  onChange={this.handleChange('email')}/>
                            <Input type="password" placeholder="Contraseña" onChange={this.handleChange('password')} />
                            <Button onClick={this.submit}>Iniciar sesión</Button>
                        </Form>
                    </div>
                </div>
        );
    }
}

export default Login;