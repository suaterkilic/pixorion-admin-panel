import React from "react";
import Header from "../../partial/Header";
import SideBar from "../../partial/SideBar";
import API from "../../../services/api/API";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";

class CategorySubSubEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parentList: [],
      subList: [],
      subSubData: [],
      parentValue: "",
      subValue: "",
      display: "",
      categoryName: "",
      modalShow: false,
      errors: {
        categoryName: "",
        parentCategory: "",
        subCategory: "",
      },
    };
  }

  parentDataFetch = () => {
    const params = {
      data: {},
      url: "category/main/list",
    };

    API.request(params)
      .then((response) => {
        const result = response.data;

        if (result.success) {
          this.setState({
            parentList: result.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  subSubDataFetch = (id) => {
    const params = {
      data: {
        value: id,
      },
      url: "category/sub/sub/where",
    };

    API.request(params)
      .then((response) => {
        const result = response.data;
        const subsub = result.data.SUBSUB;
        const subList = result.data.SUB_LIST;

        if (result.success) {
          const display = parseInt(subsub.Display);

          this.setState({
            subList: subList,
            subSubData: subsub,
            subValue: subsub.SubId,
            parentValue: subsub.ParentId,
            categoryName: subsub.Name,
            display: display,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleTextChange = (e) => {
    this.setState({
      categoryName: e.target.value,
    });
  };

  displayChange = (e) => {
    const selected = parseInt(e.target.value);

    this.setState({
      display: selected,
    });
  };

  parentChange = (e) => {
    const selected = parseInt(e.target.value);

    if (selected !== 0) {
      const params = {
        data: {
          value: selected,
        },
        url: "category/sub/get",
      };

      API.request(params)
        .then((response) => {
          const result = response.data;

          if (result.success) {
            const data = result.data;

            this.setState({
              subList: data,
              parentValue: selected,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        subList: [],
        parentValue: selected,
        subValue: "",
      });
    }
  };

  subChange = (e) => {
    const selected = parseInt(e.target.value);

    this.setState({
      subValue: selected,
    });
  };

  closeModal = () => {
    this.setState({
      modalShow: false,
    });
  };

  showModal = () => {
    const s = this.state;

    if (
      s.parentValue !== 0 &&
      s.parentValue !== "" &&
      s.subValue !== "" &&
      s.subValue !== 0 &&
      s.categoryName !== ""
    ) {
      this.setState({
        modalShow: true,
        errors: {
          categoryName: false,
        },
      });
    }
    if (s.categoryName === "") {
      this.setState({
        errors: {
          categoryName: true,
        },
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const params = {
      data: {
        id: this.state.subSubData.Id,
        parentValue: this.state.parentValue,
        subValue: this.state.subValue,
        display: this.state.display,
        categoryName: this.state.categoryName,
      },
      url: "category/sub/sub/put",
    };

    API.request(params)
      .then((response) => {
        const result = response.data;

        if (result.success) {
          const data = result.data.DATA;

          this.setState({
            subSubData: data.SUBSUB,
            modalShow: false,
          });

          swal("Başarılı!", "Alt Kategori Güncellendi!", "success");
        }else{
          swal("Başarısız!", "Alt Kategori Güncellenemedi!", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    this.parentDataFetch();
    this.subSubDataFetch(this.props.match.params.id);
  };

  render() {
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
              onClick={this.handleSubmit}
              className="btn btn-primary"
              variant="primary"
            >
              Oluştur
            </button>
            <button
              onClick={this.closeModal}
              variant="secondary"
              className="btn btn-danger"
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
                            {this.state.parentList.length > 0 && (
                              <div className="input-group mb-3">
                                <select
                                  onChange={this.parentChange}
                                  className="form-control"
                                >
                                  <option value="0">
                                    Ana Kategori Seçiniz
                                  </option>
                                  {this.state.parentList.map((parent, key) => (
                                    <>
                                      {parent.Id ===
                                      this.state.subSubData.ParentId ? (
                                        <option
                                          selected
                                          value={parent.Id}
                                          key={key}
                                        >
                                          {parent.Name}
                                        </option>
                                      ) : (
                                        <option value={parent.Id} key={key}>
                                          {parent.Name}
                                        </option>
                                      )}
                                    </>
                                  ))}
                                </select>
                              </div>
                            )}

                            {this.state.subList.length > 0 && (
                              <div className="input-group mb-3">
                                <select
                                  onChange={this.subChange}
                                  className="form-control"
                                >
                                  <option value="0">Alt Kategoriler</option>
                                  {this.state.subList.map((sub, key) => (
                                    <option value={sub.Id} key={key}>
                                      {sub.Name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <h5 className="card-title">Durumu</h5>
                            {this.state.display === 1 && (
                              <h3>
                                <span className="badge badge-success">
                                  Aktif
                                </span>
                              </h3>
                            )}
                            {this.state.display === 0 && (
                              <h3>
                                <span className="badge badge-danger">
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
                                    onChange={this.displayChange}
                                    defaultValue="1"
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
                                    onChange={this.displayChange}
                                    defaultValue="0"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="exampleRadios2"
                                  >
                                    Pasif
                                  </label>
                                </div>
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
                                onChange={this.handleTextChange}
                                name="newName"
                                className="form-control"
                                placeholder="Alt Kategori Adı"
                                value={this.state.categoryName}
                              />
                              {this.state.errors.categoryName === true && (
                                <div className="validError">
                                  Bu alan boş geçilemez
                                </div>
                              )}
                            </div>
                            <div className="form-group">
                              <button
                                onClick={() => this.showModal()}
                                type="button"
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

export default CategorySubSubEdit;
