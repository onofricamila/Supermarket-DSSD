import React from 'react';
import Product from '../product/product';
import './products-list.css';

const productsList = props => (
    <div className="products-list">
        <div className="row">
            <div className="col-sm-12 col-md-4">
                <Product />
            </div>
            <div className="col-sm-12 col-md-4">
                <Product />
            </div>
            <div className="col-sm-12 col-md-4">
                <Product />
            </div>
        </div>
    </div>
);

// Falta la paginacion

export default productsList;