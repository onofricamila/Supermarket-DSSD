import React, { Component } from 'react';
import Footer from '../src/components/footer/footer';
import Header from '../src/components/header/header';
import Login from '../src/components/login/login';
import ProductList from '../src/components/products-list/products-list'
import ProductDetail from '../src/components/product-detail/product-detail'
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AddPropsToRoute from '../src/hoc/AddPropsToRoute'

export const AuthContext = React.createContext(false);

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      products: [
        {name: "queso", type: "lacteo", price: 300}, 
        {name: "ventilador", type: "frio", price: 200}, 
        {name: "db", type: "anime", price: 100},
      ],
      authenticated: false
    }
  }

  loginHandler = () => {
    this.setState({authenticated:true});
  }

  logoutHandler = () => {
    this.setState({authenticated:false});
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
              <Route path="/buy/:id" exact component={AddPropsToRoute(ProductDetail, { name:"queso", type:"lacteo", price:"300"})} />
            </Switch>
            <Footer />
          </AuthContext.Provider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
