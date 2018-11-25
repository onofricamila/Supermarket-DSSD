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
      authenticated: ''
    }
  }

  componentWillUpdate(){
    if(this.state.products.length == 0){
      axios.get(`http://localhost:3003/products?filter=[{"field":"stock","operator":">","value":0}]&token=${this.state.authenticated}`)
      .then(response => {
          let auth = this.state.authenticated
          this.setState({ 
            products: response.data.data, 
            authenticated: auth 
          });
      }).catch(function (error) {
          console.log(error);
      })  
    }
     
  }

  loginHandler = (token) => {
    this.setState({authenticated: token});
  }

  logoutHandler = () => {
    this.setState({authenticated: ''});
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
              <Route path="/" exact component={AddPropsToRoute(ProductList, { products: this.state.products})}  />
              <Route path="/login" exact component={AddPropsToRoute(Login, { onLogin: this.loginHandler})}/>
              <Route path="/buy/:id" exact component={AddPropsToRoute(ProductDetail, { onBuy: this.hideProductWithNotEnoughStockHandler.bind(this), auth: this.state.authenticated })} />
            </Switch>
            <Footer />
          </AuthContext.Provider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
