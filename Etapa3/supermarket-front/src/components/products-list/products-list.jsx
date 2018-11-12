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
    return [renderProductsList(products), renderNextButton(nextButtonActived)];
}

function renderErrorMessage() {
    return (
        <div className="alert alert-danger" role="alert" key="errorMessage">
            No hay productos para mostrar
        </div>
    )
}

function render(props) {
    if (props.products !== undefined) {
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