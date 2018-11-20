import React from 'react';
import './product.css';

const product = props => (
    <div className="card product-container">
        <div className="card-body">
            <h3 className="card-title capitalize">{props.product.name}</h3>
            <h6 className="card-subtitle mb-2 text-muted capitalize">{props.product.producttype}</h6>
            <p className="card-text product-price-size">$ {props.product.saleprice}</p>
            <a href="#" className="btn btn-primary">Me interesa</a>
        </div>
    </div>
);

export default product;