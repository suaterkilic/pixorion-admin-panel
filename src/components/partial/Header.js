import React from "react";
import { connect } from "react-redux";
import { userLogout } from "../../actions/auth";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {},
    };

    this.logout = this.logout.bind(this);
  }

  logout = () => {
    localStorage.clear();
    this.props.userLogout();
    window.history.pushState('','', '/')
  };

  render() {
    return (
      <React.Fragment>
        <div>
          {/* START: Header*/}
          <div id="header-fix" className="header fixed-top">
            <nav className="navbar navbar-expand-lg  p-0">
              <div className="navbar-header h4 mb-0 align-self-center logo-bar text-center">
                <a href="/#0" className="horizontal-logo text-center">
                  <span className="h3 align-self-center mb-0 ">LINER</span>
                </a>
              </div>
              <div className="navbar-header h4 mb-0 text-center h-100 collapse-menu-bar">
                <a href="#" className="sidebarCollapse" id="collapse">
                  <i className="icon-menu body-color" />
                </a>
              </div>
              
              <div className="navbar-right ml-auto h-100">
                <ul className="ml-auto p-0 m-0 list-unstyled d-flex top-icon h-100">
                  <li className="dropdown align-self-center">
                    <ul className="dropdown-menu dropdown-menu-right border  py-0">
                     
                      <li>
                        <a
                          className="dropdown-item px-2 py-2 border border-top-0 border-left-0 border-right-0"
                          href="#"
                        >
                          <div className="media">
                            <img
                              src={ this.props.USER_INFO.picture }
                              alt=""
                              className="d-flex mr-3 img-fluid rounded-circle"
                            />
                            <div className="media-body">
                              <h6 className="mb-0">Bill</h6>
                              <span className="text-danger">
                                Application error.
                              </span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item text-center py-2" href="#">
                          {" "}
                          <strong>
                            See All Tasks{" "}
                            <i className="icon-arrow-right pl-2 small" />
                          </strong>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="dropdown align-self-center d-inline-block">
                    
                    <ul className="dropdown-menu dropdown-menu-right border   py-0">
                      <li>
                        <a
                          className="dropdown-item px-2 py-2 border border-top-0 border-left-0 border-right-0"
                          href="#"
                        >
                          <div className="media">
                            <img
                              src={ this.props.USER_INFO.picture }
                              alt=""
                              className="d-flex mr-3 img-fluid rounded-circle w-50"
                            />
                            <div className="media-body">
                              <h6 className="mb-0 text-success">
                                john send a message
                              </h6>
                              12 min ago
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item px-2 py-2 border border-top-0 border-left-0 border-right-0"
                          href="#"
                        >
                          <div className="media">
                            <img
                              src="/dist/images/author2.jpg"
                              alt=""
                              className="d-flex mr-3 img-fluid rounded-circle"
                            />
                            <div className="media-body">
                              <h6 className="mb-0 text-danger">
                                Peter send a message
                              </h6>
                              15 min ago
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item px-2 py-2 border border-top-0 border-left-0 border-right-0"
                          href="#"
                        >
                          <div className="media">
                            <img
                              src="/dist/images/author3.jpg"
                              alt=""
                              className="d-flex mr-3 img-fluid rounded-circle"
                            />
                            <div className="media-body">
                              <h6 className="mb-0 text-warning">
                                Bill send a message
                              </h6>
                              5 min ago
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item text-center py-2" href="#">
                          {" "}
                          <strong>
                            Read All Message{" "}
                            <i className="icon-arrow-right pl-2 small" />
                          </strong>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="dropdown user-profile align-self-center d-inline-block">
                    <a
                      href="#"
                      className="nav-link py-0"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="media">
                        <img
                          src={ this.props.USER_INFO.picture }
                          alt=""
                          className="d-flex img-fluid rounded-circle"
                          width={29}
                        />
                      </div>
                    </a>
                    <div className="dropdown-menu  dropdown-menu-right p-0">
                      <div className="dropdown-divider" />
                      <a
                        href="javascript:void(0);"
                        onClick={() => this.logout()}
                        className="dropdown-item px-2 text-danger align-self-center d-flex"
                      >
                        <span className="icon-logout mr-2 h6  mb-0" /> Logout
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
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
    userLogout: () => dispatch(userLogout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
