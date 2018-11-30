import React, { Component } from 'react';
import Footer from '../src/components/footer/footer';
import Header from '../src/components/header/header';
import Login from '../src/components/login/login';
import ProductList from '../src/components/products-list/products-list'
import ProductDetail from '../src/components/product-detail/product-detail'
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AddPropsToRoute from '../src/hoc/AddPropsToRoute'
import axios from 'axios'

export const AuthContext = React.createContext('');

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      products: [],
      authenticated: '',
      caseid: '',
    }
  }

  fillAppWithProducts(){
    var self = this
    axios.get(`http://localhost:3003/products?filter=[{"field":"stock","operator":">","value":0}]`, {headers: {'token': this.state.authenticated}})
      .then(response => {
        console.log(response)
          let auth = this.state.authenticated
          self.setState({ 
            products: this.onlyProductsWithStock(response.data.res), 
            authenticated: auth,
            caseid: response.data.caseid
          });
      }).catch(function (error) {
          console.log(error);
      })  
  }

  // componentWillMount(){
  //     
  // }

  componentWillUpdate(){
    if(this.state.products.length == 0){
      this.fillAppWithProducts()
    }
  }
  
  loginHandler = (token) => {
    this.setState({authenticated: token});
  }

  logoutHandler = () => {
    this.setState({authenticated: '', products: []});
  }

  onlyProductsWithStock(prods){
    return prods.filter(this.checkStock())
  }

  checkStock(){
    return function(prod) {
      return prod.stock > 0;
  }
  }

  decrementStockFor(id, quantity) {
    return function(prod) {
      if (prod.id == id){
        prod.stock = prod.stock - quantity
      } 
      return prod
  }
  }

  manageStockOnBuyHandler(id, quantity) {
    let currentProducts = this.state.products
    let result = currentProducts.map(this.decrementStockFor(id, quantity))
    let currentState = this.state

    this.setState({
      ...currentState,
      products: result,
    })
  }

  hideProductWithNotEnoughStockHandler(id){
    let currentProducts = this.state.products
    let result = currentProducts.filter(this.checkProduct(id))
    let currentState = this.state

    this.setState({
      ...currentState,
      products: result
    })
  }

  checkProduct(id){
    return function(prod) {
      return prod.id != id;
  }
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter basename="/">
          <AuthContext.Provider value={this.state.authenticated}>
            <Header onLogout={this.logoutHandler} />
            <Switch>
              <Route path="/" exact component={AddPropsToRoute(ProductList, { products: this.state.products, auth: this.state.authenticated})}  />
              <Route path="/login" exact component={AddPropsToRoute(Login, { auth: this.state.authenticated, onLogin: this.loginHandler})}/>
              <Route path="/buy/:id" exact component={AddPropsToRoute(ProductDetail, { caseid: this.state.caseid, products: this.state.products, onBuy: this.hideProductWithNotEnoughStockHandler.bind(this), onBuy2: this.manageStockOnBuyHandler.bind(this), auth: this.state.authenticated })} />
            </Switch>
            <Footer />
          </AuthContext.Provider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
