import React from "react";
import { connect } from "react-redux";
import { userLogin } from "../../actions/auth";
import LoginServices from "../../services/login/LoginServices";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loginError: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let params = {
      data: {
        username: this.state.username,
        password: this.state.password,
      },
      url: "admin/login",
    };

    LoginServices.login(params)
      .then((result) => {
        let res = result.data;

        if (res.success) {
          const jwt = res.jwt;

          const storageData = {
            jwt: jwt,
          };

          localStorage.setItem("session_state", JSON.stringify(storageData));
          this.props.userLogin(storageData);
          window.location = '/admin/user/list'
        } else {
          this.setState({
            username: "",
            password: "",
            loginError: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row vh-100 justify-content-between align-items-center">
            <div className="col-12">
              <form
                onSubmit={this.handleSubmit}
                className="row row-eq-height lockscreen  mt-5 mb-5"
              >
                <div className="lock-image col-12 col-sm-5" />
                <div className="login-form col-12 col-sm-7">
                  <div className="form-group mb-3">
                    <label htmlFor="emailaddress">Kullanıcı Adı</label>
                    <input
                      className="form-control"
                      type="text"
                      name="username"
                      id="emailaddress"
                      value={this.state.username}
                      required
                      placeholder="Kullanıcı adını giriniz"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">Şifre</label>
                    <input
                      className="form-control"
                      type="password"
                      name="password"
                      value={this.state.password}
                      required
                      id="password"
                      placeholder="Şifrenizi giriniz"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group mb-0">
                    <button className="btn btn-primary" type="submit">
                      Log In
                    </button>
                  </div>
                  {this.state.loginError && (
                    <p className="admin-login-error">Giriş Hatası</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
