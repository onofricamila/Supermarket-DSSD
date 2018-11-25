import React, {Component} from 'react';
import './product-detail.css';
import axios from 'axios'
import {Button} from 'reactstrap'
import {AuthContext} from '../../App';
import {Redirect} from 'react-router-dom'

class ProductDetail extends Component {
    state = {
        loadedProduct: null,
        form: {
            cant: 1,
            couponNumber: ''
        },
        msj:'¡Terminá tu compra!',
        extraDiscount: 1,
        redirect: false,
    }

    constructor(props){
        super(props);
    }

    componentWillMount(){
        var id = this.props.match.params.id
        if (id) {
            console.log('token en prod detail'+this.props.auth)
            axios.get('http://localhost:3003/products/' + id)
                .then(response => {
                    let currentState = this.state 
                    let currentForm = this.state.form 
                    this.setState({ 
                        ...currentState,
                        form: {...currentForm},
                        loadedProduct: response.data.data,
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

    isEmpty(field){
        return field.length == 0
    }

    hasOnlyDigits(field){
        var re = /^[0-9]*$/;
        return (re.test(field)) 
    }

    validCant(form){
        let currentState = this.state 
        let loadedProduct = this.state.loadedProduct
        if(this.isEmpty(form.cant)){
            this.setState({
                ...currentState,
                loadedProduct: {...loadedProduct},
                form: form,
                msj: '¡Debes ingresar la cantidad!',
            })
            return false
        }

        if (!this.hasOnlyDigits(form.cant)){
            this.setState({
                ...currentState,
                loadedProduct: {...loadedProduct},
                form: form,
                msj: '¡Debes ingresar solo números en el campo "Cantidad"!',
            })
            return false
        }

        if(loadedProduct.stock - form.cant < 0){
            this.setState({
                ...currentState,
                msj: '¡Disminuye la cantidad! Supera al stock en "' + (loadedProduct.stock - form.cant) * -1 + '" unidad/es.'
            })
            return false
        }

        return true
    }

    async validCoupon(form){
        let loadedProduct = this.state.loadedProduct
        let currentState = this.state 
        
        // esta vacio el campo del cupon, es correcto
        if(this.isEmpty(form.couponNumber)){ 
            this.setState({
                ...currentState,
                loadedProduct: {...loadedProduct},
                form: form,
                extraDiscount: 1
            })
            return true
        }
        
        // si esta completo el campo y no tiene solo digitos, es incorrecto
        if(!this.hasOnlyDigits(form.couponNumber)){
            this.setState({
                ...currentState,
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
            // no existe ese numero de cupon
            if(response.data.status == "resource not found"){
                self.setState({
                    ...currentState,
                    loadedProduct: {...loadedProduct},
                    form: form,
                    msj: '¡Número de cupón inválido!',
                }) 
                return false
            }

            // el cupon existe pero ya fue usado
            if(response.data.data.used == 1){
                self.setState({
                    ...currentState,
                    loadedProduct: {...loadedProduct},
                    form: form,
                    msj: '¡Ese cupón ya fue utilizado!',
                }) 
                return false
            }

            // existe el cupon y se puede usar
            self.setState({
                loadedProduct: {...loadedProduct},
                form: form,
                msj: 'Cupon valido',
                extraDiscount: 1-parseInt(response.data.data.discount_percentage)/100
            }) 
            return true
            
        })
        .catch(function (error) {
            console.log(error);
            self.setState({
                ...currentState,
                loadedProduct: {...loadedProduct},
                form: form,
                msj: 'Oops, hubo un problema :(',
            })      
            return false
        }) 
        
        console.log('lo de axios ' + action)
        return action
    }

    async canSubmit(){
        let form = this.state.form
        return (this.validCant(form) && this.validCoupon(form))
    }

    purchase(){
        var self = this;
        let form = this.state.form
        let loadedProduct = this.state.loadedProduct
        let currentState = this.state
       
        let params = {
            productid: loadedProduct.id,
            quantity: form.cant
        }
        
        if(!this.isEmpty(currentState.form.couponNumber)){
            params = { 
                ...params,
                coupon: form.couponNumber
            }
        }
     
        axios.post(`http://localhost:3003/buy`, params)
          .then(function (response) {
            console.log(response);
            self.setState({
                ...currentState,
                loadedProduct: {...loadedProduct},
                form: form,
                msj: 'Recibirás el producto en los próximos días :)',
                redirect: true
            })
            if(loadedProduct.stock - form.cant == 0){
                self.props.onBuy(loadedProduct.id)
            }
            
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                ...currentState,
                loadedProduct: {...loadedProduct},
                form: form,
                msj: 'Algo salio mal :(',
            })
          }) 
    }

    submit = () => {
        var self = this;

        this.canSubmit().then(result =>{ 
            console.log('Can Submit: ', result) 
            // codigo con result 
            if(result){
                let currentState = self.state
                let cant = self.state.form.cant
                let extraDiscount = self.state.extraDiscount
                let loadedProduct = self.state.loadedProduct

                let txt = 'Estas a punto de comprar "' + cant + '" unidad/es del producto "' + loadedProduct.name + '" por un total de "$' + this.roundedMultiplicationOf([extraDiscount, cant, loadedProduct.price]) + '" '
                var selection = window.confirm(txt)
                if (selection == true) {
                    self.purchase()
                } else {
                    self.setState(
                        {...currentState,
                        msj: 'Optaste por cancelar... ¿estás seguro que no quieres el producto?'
                        }
                    )
                }
            }
        })
    }

    showFinalPrice(){
        var prod = this.state.loadedProduct
        var cant = this.state.form.cant
        if(this.hasOnlyDigits(cant)){
            return  this.roundedMultiplicationOf([prod.price, cant])
        }
        return '---'
    }

    roundedMultiplicationOf(factors){
        return Math.round(factors.reduce( (a,b) => a * b )*100)/100
    }

    render() {
        if (this.state.redirect == true)  return (<Redirect to='/' />) 

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
                                <p className="card-text product-price-size">$ {this.showFinalPrice()}</p>
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
