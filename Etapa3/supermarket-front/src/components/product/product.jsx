import React from 'react';
import './product.css';
import { Button } from 'reactstrap';
import {NavLink} from 'react-router-dom'

const product = props => (
    <div className="card product-container">
        <div className="card-body">
            <h3 className="card-title capitalize">{props.product.name}</h3>
            <h6 className="card-subtitle mb-2 text-muted capitalize">{props.product.type.description}</h6>
            <p className="card-text product-price-size">$ {props.product.price}</p>
            <NavLink to={"/buy/"+props.product.id}>
                <Button outline color="info">Me interesa</Button>
            </NavLink>
        </div>
    </div>
);

export default product;