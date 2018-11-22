import React, {Component} from 'react';
import './product-detail.css';
import axios from 'axios'
import {Button} from 'reactstrap'
import {AuthContext} from '../../App';

class ProductDetail extends Component {
    state = {
        loadedProduct: null,
        form: {
            cant: 1,
            couponNumber: ''
        },
        msj:'¡Terminá tu compra!'
    }

    constructor(props){
        super(props);
    }

    componentWillMount(){
        var id = this.props.match.params.id
        if (id) {
            axios.get('http://localhost:3003/products/' + id)
                .then(response => {
                    let currentForm = this.state.form 
                    let currentMsj = this.state.msj 
                    this.setState({ 
                        form: {...currentForm},
                        loadedProduct: response.data.data,
                        msj: currentMsj
                    });
                }).catch(function (error) {
                    console.log(error);
                })  
        }
    }

    handleChange = name => event => {
        let currentState = this.state
        let currentForm = this.state.form
        this.setState({
          ...currentState,
          form: {
              ...currentForm,
              [name]: event.target.value,
          }
        })
    }

    validFields(form){
        let loadedProduct = this.state.loadedProduct

        if(this.isEmpty(form.cant)){
            this.setState({
                loadedProduct: {...loadedProduct},
                form: form,
                msj: '¡Debes ingresar la cantidad!',
            })
            return false
        }

        var re = /^[0-9]*$/;
        if (re.test(form.cant) && re.test(form.couponNumber)){
            return true
        }

        this.setState({
            loadedProduct: {...loadedProduct},
            form: form,
            msj: '¡Debes ingresar solo números!',
        })
        return false
    }

    isEmpty(field){
        return field.length == 0
    }

    hasOnlyDigits(field){
        var re = /^[0-9]*$/;
        return (re.test(field)) 
    }

    async validCoupon(form){
        // esta vacio el campo del cupon, es correcto
        if(this.isEmpty(form.couponNumber)){ return true }
        
        let loadedProduct = this.state.loadedProduct

        // si esta completo el campo y no tiene solo digitos, es incorrecto
        if(!this.hasOnlyDigits(form.couponNumber)){
            this.setState({
                loadedProduct: {...loadedProduct},
                form: form,
                msj: '¡Debes ingresar solo números para el campo "Número de cupón"!',
            })
            return false
        }

        // sabemos se lleno el campo y se ingresó un numero, veremos si corresponde a un cupon
        var self = this
        var action = await axios.get(`http://localhost:3003/coupon/${form.couponNumber}`)
        .then(function (response) {
            console.log(response)
            if(response.data.status == "resource not found"){
                self.setState({
                    loadedProduct: {...loadedProduct},
                    form: form,
                    msj: '¡Número de cupón inválido!',
                }) 
                // quiero que la funcion retorne false
                return false
            }else{
                self.setState({
                    loadedProduct: {...loadedProduct},
                    form: form,
                    msj: 'Cupon valido',
                }) 
                // quiero que la funcion retorne true
                return true
            }
        })
        .catch(function (error) {
            console.log(error);
            self.setState({
                loadedProduct: {...loadedProduct},
                form: form,
                msj: 'Oops, hubo un problema :(',
            })      
            // aca podria retornar false
            return false
        }) 
        
        console.log('lo de axios ' + action)
        return action
    }

    validCant(form){
        let loadedProduct = this.state.loadedProduct
        if(this.isEmpty(form.cant)){
            this.setState({
                loadedProduct: {...loadedProduct},
                form: form,
                msj: '¡Debes ingresar la cantidad!',
            })
            return false
        }

        if (!this.hasOnlyDigits(form.cant)){
            this.setState({
                loadedProduct: {...loadedProduct},
                form: form,
                msj: '¡Debes ingresar solo números en el campo "Cantidad"!',
            })
            return false
        }

        return true
    }

    async canSubmit(){
        let form = this.state.form
        
        return (this.validCant(form) && this.validCoupon(form))
    }

    submit = () => {
        this.canSubmit().then(result =>{ 
            console.log('Can Submit: ', result) 
            // codigo con result 
        })
       /*  if (!this.canSubmit()) return false
        var self = this;
        let form = this.state.form
        let loadedProduct = this.state.loadedProduct
        
       axios.post(`http://localhost:3003/buy`, 
            { productid: loadedProduct.id,
            quantity: form.cant
            })
          .then(function (response) {
            console.log(response);
            let msj = 'Oops! Algo salio mal'
            if (response.status == 200) {
                msj = 'Recibirás el producto en los próximos días :)'
            }
            self.setState({
                loadedProduct: {...loadedProduct},
                form: form,
                msj: msj,
            })
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                loadedProduct: {...loadedProduct},
                form: form,
                msj: 'Algo salio mal :(',
            })
          })  */
            
    }

    render() {
        let show = ""
        if(this.state.loadedProduct){
            var prod = this.state.loadedProduct

            show = (<div className="container">
            <div className="card text-center">
                <div className="card-header">
                       Accediste a comprar:
            </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-12 col-md-4">
                            <div className="product-detail-data">
                                <h3 className="card-title capitalize">{prod.name}</h3>
                                <h6 className="card-subtitle mb-2 text-muted capitalize">{prod.type.description}</h6>
                                <p className="card-text product-price-size">$ {Math.round(prod.price * this.state.form.cant * 100)/100}</p>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-8">
                            <form>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group">
                                            <label>Cantidad:</label>
                                            <input onChange={this.handleChange('cant')} className="form-control" id="cantidadProductos" placeholder="Ingrese la cantidad de productos" value={this.state.form.cant}/>
                                        </div>

                                        <AuthContext.Consumer>
                                            {auth => auth ? '' : <div className="form-group">
                                                <label>Número de cupón (opcional): </label>
                                                <input onChange={this.handleChange('couponNumber')}  className="form-control" id="cupon" placeholder="Ingrese el número de su cupón" value={this.state.form.couponNumber} />
                                            </div> }
                                        </AuthContext.Consumer>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <Button className='buyButton' onClick={this.submit}>Comprar</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="card-footer text-muted">
                         {this.state.msj}
                </div>
                </div>
            </div>
        </div>
    )

    }
    
    return show;
    
}
}

export default ProductDetail;
