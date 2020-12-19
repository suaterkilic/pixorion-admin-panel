import React from "react";
import Header from "../../partial/Header";
import SideBar from "../../partial/SideBar";
import API from "../../../services/api/API";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";

class SubCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainList: [],
      subList: [],
      isSubList: false,
      mainValue: 0,
      subValue: "",
      type: "",
      error: false,
      modalShow: false,
      selected: {},
      newCategory: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    this.setState({
      newCategory: e.target.value
    })
  }

  handleSubmit = () => {
    if(this.state.newCategory !== ''){

      const params = {
        data: {
          data: this.state.selected,
          newCategory: this.state.newCategory
        },
        url: 'category/sub/create'
      }
  
      API.request(params)
      .then((response) => {
        const result = response.data;

        if(result.success){
          swal("Başarılı!", "Yeni Kategori Oluşturuldu!", "success");
          this.setState({
            modalShow: false,
            newCategory: '',
            mainValue: 0,
            isSubList: false,
            isSubSubList: false,
            subList: [],
            subSubList: [],
            type: "",
          })
        }else{
          swal("Başarısız!", "Yeni Kategori Oluşturulamadı!", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      })
    }else{
      this.setState({
        error: true
      })
    }
  }

  closeModal = () => {
    this.setState({
      modalShow: false,
    });
  };

  showModal = () => {
    if (this.state.mainValue !== 0 && this.state.newCategory !== '') {
      const params = {
        data: {
          mainValue: this.state.mainValue,
          subValue: this.state.subValue,
          type: this.state.type,
        },
        url: "category/sub/info",
      };

      API.request(params)
        .then((response) => {
          const result = response.data;

          if (result.success) {
            const data = result.data;
            if (this.state.type == "sub") {

              const temp = {};

              temp.Id = data.Id;
              temp.Name = data.CategoryName;
              temp.Type = 'sub';

              this.setState({
                selected: temp,
              });
            } else {

              const temp = {};

              temp.Id = data.Id;
              temp.Name = data.Name;
              temp.ParentId = data.ParentId;
              temp.Type = 'subsub';

              this.setState({
                selected: temp,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      this.setState({
        modalShow: true,
        error: false
      });
    }else{
      this.setState({
        error: true
      })
    }
  };

  subCategoryChange = (e) => {
    const selectedValue = parseInt(e.target.value);

    if (selectedValue !== 0) {
      this.setState({
        subValue: selectedValue,
        type: "subsub",
      });
    } else {

      const temp = {};

      temp.Id = this.state.mainValue;
      temp.Type = 'sub';
      
      this.setState({
        subValue: 0,
        type: "sub",
        selected: temp
      });
    }
  };

  parentCategoryChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    if (selectedValue !== 0) {
    console.log('İlk Value: ' + selectedValue)
      const params = {
        data: {
          value: selectedValue,
        },
        url: "category/sub/get",
      };

      API.request(params)
        .then((response) => {
          const result = response.data;
          if (result.success) {
            this.setState({
              subList: result.data,
              isSubList: true,
              mainValue: selectedValue,
              type: "sub",
            });
          }else{
            this.setState({
              mainValue: selectedValue,
              type: 'sub'
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        mainValue: 0,
        isSubList: false,
        isSubSubList: false,
        subList: [],
        subSubList: [],
        type: "",
      });
    }
  };

  getMainCategory = () => {
    let params = {
      data: {},
      url: "category/main/list",
    };

    API.request(params)
      .then((response) => {
        let result = response.data;
        let mainList = result.data;

        this.setState({
          mainList: mainList,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    this.getMainCategory();
  };

  render() {
    return (
      <React.Fragment>
        <Header USER_INFO={this.props.USER_INFO} />
        <SideBar USER_INFO={this.props.USER_INFO} />
        <Modal show={this.state.modalShow} onHide={() => this.closeModal()}>
          <Modal.Header closeButton>
            <Modal.Title>Alt Kategori 0luştur</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>
              Bu kategoriyi
              <span className="selected-category badge p-2 badge-warning mb-1">
                {" " + this.state.selected.Name + " "}
              </span>
              kategorisine eklemek istediğinize emin misiniz?
            </h4>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={() => this.handleSubmit()} className="btn btn-primary" variant="primary">
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
                    <h4 className="card-title">Alt Kategori Oluştur</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <form>
                            <label htmlFor="mainCategory">
                              Ana Kategori Seçiniz
                            </label>
                            <div className="input-group mb-3">
                              <select
                                onChange={(e) => this.parentCategoryChange(e)}
                                className="form-control"
                              >
                                {
                                  this.state.mainValue === 0 ? (
                                    <option selected value="0">Ana Kategori Seçiniz</option>
                                  ):(
                                    <option value="0">Ana Kategori Seçiniz</option>
                                  )
                                }
                                {this.state.mainList.length > 0 &&
                                  this.state.mainList.map((main, key) => (
                                    <option key={key} value={main.Id}>
                                      {main.Name}
                                    </option>
                                  ))}
                              </select>
                            </div>

                            {this.state.isSubList === true && (
                              <div className="input-group mb-3">
                                <select
                                  className="form-control"
                                  onChange={(e) => this.subCategoryChange(e)}
                                >
                                  <option value="0">
                                    Alt Kategori Seçiniz
                                  </option>
                                  {this.state.subList.length > 0 &&
                                    this.state.subList.map((sub, key) => (
                                      <option value={sub.Id} key={key}>
                                        {sub.Name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            )}

                            <label
                              style={{ marginTop: "16px" }}
                              htmlFor="username"
                            >
                              Alt Kategori Adı
                            </label>
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
                                name="name"
                                value={this.state.newCategory}
                                onChange={this.handleChange}
                                className="form-control"
                                placeholder="Alt Kategori Adı"
                              />
                              {
                                this.state.error == true && (
                                  <div className="validError">
                                    Bu alan boş geçilemez
                                  </div>
                                )
                              }
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
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default SubCreate;
