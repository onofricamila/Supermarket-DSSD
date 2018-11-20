import React, {Component} from 'react';
import './product-detail.css';
import axios from 'axios'

class ProductDetail extends Component {
    state = {
        loadedProduct: null,
    }

    constructor(props){
        super(props);
    }

    componentWillMount(){
        var id = this.props.match.params.id
        var self = this
        if (id) {
            axios.get('http://localhost:3010/api/products/' + id)
                .then(response => {
                    self.setState({ loadedProduct: response.data.data });
                }).catch(function (error) {
                    console.log(error);
                })  
        }
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
                                            <input type="number" className="form-control" id="cantidadProductos" placeholder="Ingrese la cantidad de productos" required min="1" defaultValue="1"/>
                                        </div>
                                        <div className="form-group">
                                            <label>Número de cupón</label>
                                            <input type="Number" className="form-control" id="cupon" placeholder="Ingrese el número de su cupón" />
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
