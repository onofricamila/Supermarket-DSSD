import React from 'react';
import './product.css';

const product = props => (
    <div className="card product-container">
        <div className="card-body">
            <h3 className="card-title capitalize">{props.name}</h3>
            <h6 className="card-subtitle mb-2 text-muted capitalize">{props.type}</h6>
            <p className="card-text product-price-size">$ {props.price}</p>
            <a href="#" class="btn btn-primary">Comprar</a>
        </div>
    </div>
);


export default product;