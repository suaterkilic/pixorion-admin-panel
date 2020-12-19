import React from "react";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";

class SideBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: {
        content: false,
        admin: false,
        categories: false,
        product: false,
        slider: false,
      },
    };
    this.toggleClass = this.toggleClass.bind(this);
  }

  toggleClass = (key) => {
    let statusCopy = Object.assign({}, this.state);
    console.log(key, " Key");
    statusCopy.active[key] = !statusCopy.active[key];
    console.log(statusCopy.active);
    this.setState({
      active: statusCopy.active,
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="sidebar">
          <div className="media d-block text-center user-profile">
            <img
              className="main-avatar img-fluid"
              src={this.props.USER_INFO.picture}
              alt=""
            />
            <div className="media-body text-center mt-0 color-primary mt-2">
              <a
                href="javascript:void(0);"
                className="nav-link py-0"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <h6 className="mb-0 font-weight-bold">
                  {this.props.USER_INFO.name +
                    " " +
                    this.props.USER_INFO.surname}
                </h6>
                <p>{this.props.USER_INFO.authority}</p>
              </a>
            </div>
          </div>
          {/* START: Menu*/}
          <ul id="side-menu" className="sidebar-menu">
            <li className="dropdown">
              <a href="javascript:void(0);">Kurumsal Yönetim</a>
              <ul>
                <li
                  onClick={() => this.toggleClass("content")}
                  className={
                    this.state.active.content == true
                      ? "dropdown active"
                      : "dropdown"
                  }
                >
                  <a href="javascript:void(0);">
                    <i className="icon-envelope" />
                    İçerikler
                  </a>
                  <ul className="sub-menu">
                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/about">
                          <i className="icon-envelope" /> Hakkımızda
                        </NavLink>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/order/info">
                          <i className="icon-envelope" /> İade ve Teslimat
                          İçeriği
                        </NavLink>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/contact">
                          <i className="icon-envelope" /> İletişim
                        </NavLink>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <ul>
                <li
                  onClick={() => this.toggleClass("admin")}
                  className={
                    this.state.active.admin == true
                      ? "dropdown active"
                      : "dropdown"
                  }
                >
                  <a className="deneme" href="#0">
                    <i className="icon-envelope" />
                    Admin Yönetimi
                  </a>
                  <ul className="sub-menu">
                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/admin/user/insert">
                          <i className="icon-envelope" /> Admin Ekle
                        </NavLink>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/admin/user/list">
                          <i className="icon-eye" /> Admin Düzenle
                        </NavLink>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0);">Kategori Yönetimi</a>
              <ul>
                <li
                  onClick={() => this.toggleClass("categories")}
                  className={
                    this.state.active.categories == true
                      ? "dropdown active"
                      : "dropdown"
                  }
                >
                  <a className="deneme" href="#0">
                    <i className="icon-envelope" />
                    Kategoriler
                  </a>
                  <ul className="sub-menu">
                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/category/main/create">
                          <i className="icon-energy" /> Ana Kategori Oluştur
                        </NavLink>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/category/main/list">
                          <i className="icon-disc" /> Ana Kategori Listele
                        </NavLink>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/category/sub/create">
                          <i className="icon-energy" /> Alt Kategori Oluştur
                        </NavLink>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/category/sub/list">
                          <i className="icon-disc" /> Alt Kategori Listele
                        </NavLink>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0);">Ürün Yönetimi</a>
              <ul>
                <li
                  onClick={() => this.toggleClass("product")}
                  className={
                    this.state.active.product == true
                      ? "dropdown active"
                      : "dropdown"
                  }
                >
                  <a className="deneme" href="#0">
                    <i className="icon-envelope" />
                    Ürünler
                  </a>
                  <ul className="sub-menu">
                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/product/create">
                          <i className="icon-energy" /> Ürün Ekle
                        </NavLink>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/product/list">
                          <i className="icon-disc" /> Ürün Listele
                        </NavLink>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0);">Görsel Yönetimi</a>
              <ul>
                <li
                  onClick={() => this.toggleClass("slider")}
                  className={
                    this.state.active.slider == true
                      ? "dropdown active"
                      : "dropdown"
                  }
                >
                  <a href="#0">
                    <i className="icon-envelope" />
                    Görseller
                  </a>
                  <ul className="sub-menu">
                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/visual/slider/create">
                          <i className="icon-energy" /> Slider Ekle
                        </NavLink>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0);">
                        <NavLink to="/visual/slider/list">
                          <i className="icon-disc" /> Slider Listele
                        </NavLink>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          {/* END: Menu*/}
        </div>
      </React.Fragment>
    );
  }
}

export default SideBar;
