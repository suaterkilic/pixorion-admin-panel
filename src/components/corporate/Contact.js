import React from "react";
import Header from "../partial/Header";
import SideBar from "../partial/SideBar";
import API from "../../services/api/API";
import swal from "sweetalert";

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      phone: "",
      map: "",
      facebook: "",
      instagram: "",
      twitter: "",
    };
  }

  textChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const params = {
      data: {
        address: this.state.address,
        phone: this.state.phone,
        facebook: this.state.facebook,
        instagram: this.state.instagram,
        twitter: this.state.twitter,
        map: this.state.map
      },
      url: "corporate/contact/put",
    };

    API.request(params)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          swal("Başarılı", "İletişim bilgileri güncellendi !", "success");
        } else {
          swal("Başarısız", "İletişim bilgileri güncellenemedi !", "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchData = () => {
    const params = {
      data: {},
      url: "corporate/contact",
    };

    API.request(params)
      .then((res) => {
        const result = res.data;

        if (result.success) {
          const data = result.data;
          this.setState({
            address: data.Address,
            phone: data.Phone,
            map: data.Map,
            facebook: data.Facebook,
            instagram: data.Instagram,
            twitter: data.Twitter,
          });
        }
      })
      .catch((err) => {});
  };

  componentDidMount = () => {
    this.fetchData();
  };

  render() {
    return (
      <React.Fragment>
        <Header USER_INFO={this.props.USER_INFO} />
        <SideBar USER_INFO={this.props.USER_INFO} />
        <main>
          <div className="container-fluid">
            {/* START: Breadcrumbs*/}
            <div className="row ">
              <div className="col-12  align-self-center">
                <div className="sub-header mt-3 py-3 px-3 align-self-center d-sm-flex w-100 rounded">
                  <div className="w-sm-100 mr-auto">
                    <h4 className="mb-0">Kurumsal Yönetim</h4>
                  </div>
                </div>
              </div>
            </div>
            {/* END: Breadcrumbs*/}
            {/* START: Card Data*/}
            <div className="row">
              <div className="col-12 col-lg-6 mt-3">
                <div className="card category-form">
                  <div className="card-header">
                    <h4 className="card-title">İletişim Güncelle</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <form onSubmit={(e) => this.handleSubmit(e)}>
                            <label>Telefon</label>
                            <div className="input-group  mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text bg-transparent border-right-0"
                                  id="basic-addon1"
                                >
                                  <i className="icon-menu" />
                                </span>
                              </div>

                              <input
                                type="text"
                                onChange={this.textChange}
                                name="phone"
                                value={this.state.phone}
                                className="form-control"
                                placeholder="Telefon"
                              />
                            </div>

                            <label>Facebook</label>

                            <div className="input-group  mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text bg-transparent border-right-0"
                                  id="basic-addon1"
                                >
                                  <i className="icon-menu" />
                                </span>
                              </div>

                              <input
                                type="text"
                                onChange={this.textChange}
                                name="facebook"
                                value={this.state.facebook}
                                className="form-control"
                                placeholder="Facebook"
                              />
                            </div>
                            <label>Twitter</label>

                            <div className="input-group  mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text bg-transparent border-right-0"
                                  id="basic-addon1"
                                >
                                  <i className="icon-menu" />
                                </span>
                              </div>

                              <input
                                type="text"
                                onChange={this.textChange}
                                name="twitter"
                                value={this.state.twitter}
                                className="form-control"
                                placeholder="Twitter"
                              />
                            </div>
                            <label>Instagram</label>

                            <div className="input-group  mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text bg-transparent border-right-0"
                                  id="basic-addon1"
                                >
                                  <i className="icon-menu" />
                                </span>
                              </div>

                              <input
                                type="text"
                                onChange={this.textChange}
                                name="instagram"
                                value={this.state.instagram}
                                className="form-control"
                                placeholder="Instagram"
                              />
                            </div>


                            <label htmlFor="exampleFormControlTextarea1">
                              Adres
                            </label>
                            <div className="input-group mb-3">
                              <textarea
                                name="address"
                                onChange={this.textChange}
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows={3}
                                value={this.state.address}
                                defaultValue={""}
                              />
                            </div>

                            <label htmlFor="exampleFormControlTextarea1">
                              Harita
                            </label>
                            <div className="input-group mb-3">
                              <textarea
                                name="map"
                                onChange={this.textChange}
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows={3}
                                value={this.state.map}
                                defaultValue={""}
                              />
                            </div>

                            <div className="input-group mb-3 mt-3">
                              <button
                                type="submit"
                                className="mb-3 btn btn-primary"
                              >
                                GÜNCELLE
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default Contact;
