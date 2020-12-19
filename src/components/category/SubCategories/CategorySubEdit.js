import React from "react";
import Header from "../../partial/Header";
import SideBar from "../../partial/SideBar";
import API from "../../../services/api/API";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";

class CategorySubEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainList: [],
      sub: [],
      display: "",
      parentId: "",
      newName: "",
      error: false,
      modalShow: false,
      isLoading: false
    };

    this.handleNewName = this.handleNewName.bind(this);
  }

  fetchData = (id) => {
    const params = {
      data: {},
      url: "category/main/list",
    };

    API.request(params)
      .then((response) => {
        const result = response.data;

        if (result.success) {
          this.setState({
            mainList: result.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  subCategoryDetail = (id) => {
    const params = {
      data: {
        value: id,
      },
      url: "category/sub/where",
    };

    API.request(params)
      .then((response) => {
        const result = response.data;

        if (result.success) {
          this.setState({
            sub: result.data,
            parentId: result.data.ParentId,
            newName: result.data.Name,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  displayChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    this.setState({
      display: selectedValue,
    });
  };

  handleNewName = (e) => {
    this.setState({
      newName: e.target.value,
    });
  };

  parentChange = (e) => {
    const selectedValue = parseInt(e.target.value);

    if (selectedValue !== 0) {
      this.setState({
        parentId: selectedValue,
      });
    } else {
      this.setState({
        parentId: 0,
      });
    }
  };

  closeModal = () => {
    this.setState({
      modalShow: false,
    });
  };

  showModal = () => {
    if (
      this.state.parentId !== "" &&
      this.state.parentId !== 0 &&
      this.state.newName !== "" &&
      this.state.display !== ""
    ) {
      this.setState({
        modalShow: true,
        error: false,
      });

      console.log("Hepsi Dolur");
    }
    if (this.state.newName === "") {
      this.setState({
        error: true,
      });
    }
    if (this.state.display === "") {
      this.setState({
        error: true,
      });
    }
  };

  handleSubmit = () => {
    const params = {
      data: {
        id: this.state.sub.Id,
        parentId: this.state.parentId,
        newName: this.state.newName,
        display: this.state.display,
      },
      url: "category/sub/put",
    };

    API.request(params)
      .then((response) => {
        const result = response.data;

        if (result.success) {
          
          const data = result.data;

          swal("Başarılı!", "Alt Kategori Güncellendi!", "success");
          
          this.setState({
            modalShow: false,
            sub: data.DATA,
            display: ''
          });

        } else {
          swal("Başarısız!", "Alt Kategori Güncellenmedi", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    const id = this.props.match.params.id;

    this.fetchData(id);
    this.subCategoryDetail(id);
  };

  render() {
    if(this.state.isLoading) return <div>Loading..</div>
    return (
      <React.Fragment>
        <Header USER_INFO={this.props.USER_INFO} />
        <SideBar USER_INFO={this.props.USER_INFO} />
        <Modal show={this.state.modalShow} onHide={() => this.closeModal()}>
          <Modal.Header closeButton>
            <Modal.Title>Alt Kategori Güncelle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Kategoriyi güncellemek istediğinize emin misiniz?</h4>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => this.handleSubmit()}
              className="btn btn-primary"
              variant="primary"
            >
              Oluştur
            </button>
            <button
              variant="secondary"
              className="btn btn-danger"
              onClick={() => this.closeModal()}
            >
              İptal
            </button>
          </Modal.Footer>
        </Modal>
        <main>
          <div className="container-fluid">
            {/* START: Breadcrumbs*/}
            <div className="row ">
              <div className="col-12  align-self-center">
                <div className="sub-header mt-3 py-3 px-3 align-self-center d-sm-flex w-100 rounded">
                  <div className="w-sm-100 mr-auto">
                    <h4 className="mb-0">Alt Kategori Yönetimi</h4>
                  </div>
                </div>
              </div>
            </div>
            {/* END: Breadcrumbs*/}
            {/* START: Card Data*/}
            <div className="row">
              <div className="col-12 col-lg-8 mt-3">
                <div className="card category-form">
                  <div className="card-header">
                    <h4 className="card-title">Alt Kategori Düzenle</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <form>
                            <label htmlFor="mainCategory">
                              Ana Kategori Seçiniz
                            </label>
                            {this.state.mainList.length > 0 && (
                              <div className="input-group mb-3">
                                <select
                                  onChange={this.parentChange}
                                  className="form-control"
                                >
                                  <option value="0">
                                    Ana Kategori Seçiniz
                                  </option>
                                  {this.state.mainList.map((main, key) => (
                                    <>
                                      {this.state.sub.ParentId == main.Id ? (
                                        <option
                                          selected
                                          value={main.Id}
                                          key={key}
                                        >
                                          {main.Name}
                                        </option>
                                      ) : (
                                        <option value={main.Id} key={key}>
                                          {main.Name}
                                        </option>
                                      )}
                                    </>
                                  ))}
                                </select>
                              </div>
                            )}

                            <h5 className="card-title">Durumu</h5>
                            {this.state.sub.Display == "1" && (
                              <h3>
                                <span className="badge badge-success">
                                  Aktif
                                </span>
                              </h3>
                            )}

                            {this.state.sub.Display == "0" && (
                              <h3>
                                <span className="badge badge-danger ">
                                  Pasif
                                </span>
                              </h3>
                            )}
                            <div
                              style={{ marginTop: "16px" }}
                              className="input-group  mb-3"
                            >
                              <div>
                                <div
                                  className="form-check"
                                  style={{
                                    float: "left",
                                  }}
                                >
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios1"
                                    defaultValue="1"
                                    onChange={this.displayChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="exampleRadios1"
                                  >
                                    Aktif
                                  </label>
                                </div>
                                <div
                                  className="form-check"
                                  style={{
                                    float: "right",
                                    marginLeft: "10px",
                                  }}
                                >
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios2"
                                    defaultValue="0"
                                    onChange={this.displayChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="exampleRadios2"
                                  >
                                    Pasif
                                  </label>
                                </div>
                                {this.state.error == true && (
                                  <div className="validError">
                                    Bu alan boş geçilemez
                                  </div>
                                )}
                              </div>
                            </div>

                            <h5
                              style={{ marginTop: "16px" }}
                              htmlFor="username"
                            >
                              Alt Kategori Adı
                            </h5>
                            <div
                              style={{ marginTop: "16px" }}
                              className="input-group  mb-3"
                            >
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
                                name="newName"
                                className="form-control"
                                placeholder="Alt Kategori Adı"
                                onChange={this.handleNewName}
                                value={this.state.newName}
                              />
                              {this.state.error == true && this.state.newName == '' && (
                                <div className="validError">
                                  Bu alan boş geçilemez
                                </div>
                              )}
                            </div>
                            <div className="form-group">
                              <button
                                type="button"
                                onClick={() => this.showModal()}
                                className="btn btn-primary"
                              >
                                Oluştur
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
            {/* END: Card DATA*/}
            {/* START: Card DATA*/}

            {/* END: Card DATA*/}
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default CategorySubEdit;
