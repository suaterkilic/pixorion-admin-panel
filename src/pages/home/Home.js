import React from "react";
import Header from "../../components/partial/Header";
import SideBar from "../../components/partial/SideBar";
import jwt_decode from "jwt-decode";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <Header USER_INFO={ this.props.USER_INFO } />
        <SideBar USER_INFO={ this.props.USER_INFO } />
      </React.Fragment>
    );
  }
}

export default Home;
