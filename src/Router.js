import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from './components/partial/Header';
import SideBar from './components/partial/SideBar';
import Login from "./components/login/Login";
import Home from "./pages/home/Home";
import UserStore from "./components/admins/UserStore";
import UserList from "./components/admins/UserList";
import CategoryMainCreate from "./components/category/MainCreate";
import CategoryMainList from "./components/category/MainList";
import CategoryMainEdit from "./components/category/MainEdit";
import CategorySubCreate from "./components/category/SubCategories/SubCreate";
import CategorySubList from "./components/category/SubCategories/SubList";
import CategorySubEdit from "./components/category/SubCategories/CategorySubEdit";
import CategorySubSubEdit from "./components/category/SubCategories/CategorySubSubEdit";
import ProductCreate from "./components/products/ProductCreate";
import ProductList from './components/products/ProductList';
import ProductEdit from './components/products/ProductEdit';
import jwt_decode from "jwt-decode";
import UserEdit from "./components/admins/UserEdit";
import SliderCreate from './components/visual/slider/SliderCreate';
import SliderList from './components/visual/slider/SliderList';
import SliderEdit from './components/visual/slider/SliderEdit';
import About from './components/corporate/About';
import Contact from './components/corporate/Contact';
import OrderInfo from './components/corporate/OrderInfo';
import { userLogin } from "./actions/auth";
import { connect } from "react-redux";



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {},
    };
  }

  componentDidMount = () => {
    if (localStorage.getItem("session_state")) {
      this.props.userLogin(JSON.parse(localStorage.getItem("session_state")));

      const jwt = localStorage.getItem("session_state");
      const token = JSON.parse(jwt).jwt;

      const decoded = jwt_decode(token);
      const data = decoded.data;

      const userInfo = {
        id: data.id,
        name: data.name,
        surname: data.surname,
        username: data.username,
        picture: data.profile_picture,
        authority: data.authority,
        jwt: token,
      };

      this.setState({
        userInfo: userInfo,
      });
    }
  };

  render() {
    const { userInfo } = this.state;

    if (this.props.user) {
      return (
        <React.Fragment>
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                component={() => <Home USER_INFO={userInfo} />}
              />
              <Route
                exact
                path="/admin/user/insert"
                component={() => <UserStore USER_INFO={userInfo} />}
              />
              <Route
                path="/admin/user/list"
                component={() => <UserList USER_INFO={userInfo} />}
              />
              <Route
                path="/admin/user/edit/:id"
                component={(props) => (
                  <UserEdit {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/category/main/create"
                component={(props) => (
                  <CategoryMainCreate {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/category/main/list"
                component={(props) => (
                  <CategoryMainList {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/category/main/edit/:id"
                component={(props) => (
                  <CategoryMainEdit {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/category/sub/create"
                component={() => <CategorySubCreate USER_INFO={userInfo} />}
              />
              <Route
                path="/category/sub/list"
                component={() => <CategorySubList USER_INFO={userInfo} />}
              />

              <Route
                path="/category/sub/edit/:id"
                component={(props) => (
                  <CategorySubEdit {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/category/sub/sub/edit/:id"
                component={(props) => (
                  <CategorySubSubEdit {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/product/create"
                component={(props) => (
                  <ProductCreate {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/product/list"
                component={(props) => (
                  <ProductList {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/product/edit/:id"
                component={(props) => (
                  <ProductEdit {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/visual/slider/create"
                component={(props) => (
                  <SliderCreate {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/visual/slider/list"
                component={(props) => (
                  <SliderList {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/visual/slider/edit/:id"
                component={(props) => (
                  <SliderEdit {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/about"
                component={(props) => (
                  <About {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/order/info"
                component={(props) => (
                  <OrderInfo {...props} USER_INFO={userInfo} />
                )}
              />
              <Route
                path="/contact"
                component={(props) => (
                  <Contact {...props} USER_INFO={userInfo} />
                )}
              />
            </Switch>
          </Router>
        </React.Fragment>
      );
    } else {
      return <Login />;
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userLogin: (user) => dispatch(userLogin(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
