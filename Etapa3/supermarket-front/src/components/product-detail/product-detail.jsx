import React from 'react';
import './product-detail.css';

const productDetail = props => (
    <div className="container">
        <div className="card text-center">
            <div className="card-header">
                ¡Terminá tu compra!
         </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-12 col-md-4">
                        <div class="product-detail-data">
                            <h3 className="card-title capitalize">{props.name}</h3>
                            <h6 className="card-subtitle mb-2 text-muted capitalize">{props.type}</h6>
                            <p className="card-text product-price-size">$ {props.price}</p>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-8">
                        <form>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <div className="form-group">
                                        <label for="cantidadProductos">Cantidad de productos</label>
                                        <input type="number" className="form-control" id="cantidadProductos" placeholder="Ingrese la cantidad de productos" required min="1" defaultValue="1"/>
                                    </div>
                                    <div className="form-group">
                                        <label for="cupon">Número de cupón</label>
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
);

export default productDetail;
