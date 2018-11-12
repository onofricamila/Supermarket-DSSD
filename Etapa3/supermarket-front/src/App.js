import React, { Component } from 'react';
import Footer from '../src/components/footer/footer';
import Header from '../src/components/header/header';
import Login from '../src/components/login/login';
import ProductList from '../src/components/products-list/products-list'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Login />
        <ProductList nextButtonActived={true} products={[{name: "queso", type: "lacteo", price: 300}, {name: "ventilador", type: "frio", price: 200}, {name: "db", type: "anime", price: 100}]} />
        <Footer />
      </div>
    );
  }
}

export default App;
