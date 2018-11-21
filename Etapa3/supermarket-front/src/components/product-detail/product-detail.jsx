import React, {Component} from 'react';
import './product-detail.css';
import axios from 'axios'
import {Button} from 'reactstrap'

class ProductDetail extends Component {
    state = {
        loadedProduct: null,
        form: {
            cant: 1,
            couponNumber: 0
        },
        msj:'¡Terminá tu compra!'
    }

    constructor(props){
        super(props);
    }

    componentWillMount(){
        var id = this.props.match.params.id
        if (id) {
            axios.get('http://localhost:3000/api/products/' + id)
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
        var re = /^[0-9]*$/;
        if (re.test(form.cant) && re.test(form.couponNumber)){
            return true
        }

        let loadedProduct = this.state.loadedProduct

        this.setState({
            loadedProduct: {...loadedProduct},
            form: form,
            msj: 'Debes ingresar números!',
        })
        return false
    }

    canSubmit(){
        let form = this.state.form
        console.log(this.validFields(form))
        return (this.validFields(form))
    }

    submit = () => {
        if (!this.canSubmit()) return false
        
        var self = this;
        let form = this.state.form
        let loadedProduct = this.state.loadedProduct
        
       /*  axios.post(`http://localhost:3003/api/employees?filter=[{"field":"email","value":"${credentials.email}"},{"field":"password","value":"${credentials.password}"}]`)
          .then(function (response) {
            console.log(response);
            if (response.data =! null) {
                self.setState({
                    redirect: true
                })
            }
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                loadedProduct: {...loadedProduct},
                form: form,
                msj: 'Algo salio mal :(',
            })
          })   */
            
    }

    render() {
        let product = ""
        if(this.state.loadedProduct){
            var prod = this.state.loadedProduct

            product = (<div className="container">
            <div className="card text-center">
                <div className="card-header">
                       {this.state.msj}
            </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-12 col-md-4">
                            <div className="product-detail-data">
                                <h3 className="card-title capitalize">{prod.name}</h3>
                                <h6 className="card-subtitle mb-2 text-muted capitalize">{prod.producttype}</h6>
                                <p className="card-text product-price-size">$ {prod.saleprice}</p>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-8">
                            <form>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="form-group">
                                            <label>Cantidad de productos</label>
                                            <input type="number" onChange={this.handleChange('cant')} className="form-control" id="cantidadProductos" placeholder="Ingrese la cantidad de productos" min="1" value={this.state.form.cant}/>
                                        </div>
                                        <div className="form-group">
                                            <label>Número de cupón</label>
                                            <input type="Number" onChange={this.handleChange('couponNumber')} min="0" className="form-control" id="cupon" placeholder="Ingrese el número de su cupón" value={this.state.form.couponNumber} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <Button  onClick={this.submit}>Comprar</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="card-footer text-muted">
                        Recibirás el producto en los próximos días
                </div>
                </div>
            </div>
        </div>
    )

    }
    
    return product;
    
}
}

export default ProductDetail;
