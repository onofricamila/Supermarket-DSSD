import React from 'react';
import './product.css';

const product = props => (
    <div className="product-container">
        <h4 className="product-name">
            {props.name}
        </h4>
        <p className="product-type">
            {props.type}
        </p>
        <div className="product-price-button">
            <h3 className="product-price">
                $ {props.price}
            </h3>
            <button type="button" className="product-buy">
                <span>Comprar</span>
            </button>
        </div>
    </div>
);


export default product;