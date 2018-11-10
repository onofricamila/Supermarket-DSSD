import React from 'react';
import './product.css';

const product = props => (
    <div className="product-container">
        <h4 className="product-name">
            Nombre del producto
        </h4>
        <p className="product-type">
            Tipo de producto
        </p>
        <div class="product-price-button">
            <h3 className="product-price">
                $ 2000
            </h3>
            <button type="button" className="product-buy">
                <span>Comprar</span>
            </button>
        </div>
    </div>
);


export default product;