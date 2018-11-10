import React, { Component } from 'react';
import Footer from '../src/components/footer/footer';
import Header from '../src/components/header/header';
import Login from '../src/components/login/login';
import Product from '../src/components/product/product';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Login />
        <Product />
        <Footer />
      </div>
    );
  }
}

export default App;
