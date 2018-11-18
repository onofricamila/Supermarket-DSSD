import React from 'react';
import Product from '../product/product';
import './products-list.css';

function renderProduct(aProduct, index) {
    return (
        <div className="col-sm-12 col-md-4" key={"product-" + index}>
            <Product name={aProduct.name} type={aProduct.type} price={aProduct.price} />
        </div>
    )
}

function renderProductsList(products) {
    return (
        <div className="products-list" key="productList">
            <div className="container">
                <div className="product-list-title-container">
                    <h2 className="product-list-title">¡Nuestros mejores productos te están esperando!</h2>
                    <hr />
                </div>
                <div className="row products-list-row">
                    {products.map((element, index) => {
                        return renderProduct(element, index);
                    })}
                </div>
            </div>
        </div>
    )
}

function renderNextButton(nextButtonActived) {
    if (nextButtonActived) {
        return <button type="button" className="btn btn-primary btn-lg nextButton" key="nextButton">Siguiente</button>
    } else {
        return <button type="button" className="btn btn-primary btn-lg nextButton" disabled key="nextButton">Siguiente</button>
    }
}

function renderProductsContainer(products, nextButtonActived) {
    // return [renderProductsList(products), renderNextButton(nextButtonActived)];
    return [renderProductsList(products)]
}

function renderErrorMessage() {
    return (
        <div className="products-list-error-message-container">
            <div className="alert alert-warning products-list-error-message" role="alert">
                No hay productos para mostrar
            </div>
        </div>
    )
}

function render(props) {
    if (props.products !== undefined && props.products.length > 0) {
        return renderProductsContainer(props.products, props.nextButtonActived);
    } else {
        return renderErrorMessage();
    }
}


const productsList = props => (
    <div className="products-list-container">
        {render(props)}
    </div>
);

export default productsList;