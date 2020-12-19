import React from "react";
import Header from "../partial/Header";
import SideBar from "../partial/SideBar";
import API from "../../services/api/API";
import swal from "sweetalert";

class OrderInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
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
        title: this.state.title,
        content: this.state.content,
      },
      url: "corporate/order/info/put",
    };

    API.request(params).then((res) => {
        const result = res.data;
        if(result.success){
            swal('Başarılı', 'İçerik güncellendi !', 'success');
        }else{
            swal('Başarısız', 'İçerik güncellenemedi !', 'error');
        }
    })
    .catch((err) => {
        console.log(err);
    })
  };

  fetchData = () => {
    const params = {
      data: {},
      url: "corporate/order/info",
    };

    API.request(params)
      .then((res) => {
        const result = res.data;

        if (result.success) {
          const data = result.data;
          this.setState({
            title: data.Title,
            content: data.Content,
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
                    <h4 className="card-title">Sipariş Teslim ve İade Detayları</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <form onSubmit={(e) => this.handleSubmit(e)}>
                            <label>Başlık</label>
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
                                name="title"
                                value={this.state.title}
                                className="form-control"
                                placeholder="Başlık"
                              />
                            </div>

                            <label htmlFor="exampleFormControlTextarea1">
                              İçerik Yazısı
                            </label>
                            <div className="input-group mb-3">
                              <textarea
                                name="content"
                                onChange={this.textChange}
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows={3}
                                cols={50}
                                value={this.state.content}
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

export default OrderInfo;
