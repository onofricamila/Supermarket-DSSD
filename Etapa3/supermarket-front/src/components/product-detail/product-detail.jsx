import React, {Component} from 'react';
import './product-detail.css';
import axios from 'axios'

class ProductDetail extends Component {
    state = {
        loadedProduct: null,
        form:{
            cant: 1,
            couponNumber:''
        }
    }

    constructor(props){
        super(props);
    }

    componentWillMount(){
        var id = this.props.match.params.id
        if (id) {
            axios.get('http://localhost:3010/api/products/' + id)
                .then(response => {
                    let currentForm = this.state.form
                    this.setState({ 
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

    render() {
        let product = ""
        if(this.state.loadedProduct){
            var prod = this.state.loadedProduct

            product = (<div className="container">
            <div className="card text-center">
                <div className="card-header">
                    ¡Terminá tu compra!
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
                                            <input type="Number" onChange={this.handleChange('couponNumber')} className="form-control" id="cupon" placeholder="Ingrese el número de su cupón" value={this.state.form.couponNumber} />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <button type="submit" className="btn btn-primary buyButton">Comprar</button>
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
