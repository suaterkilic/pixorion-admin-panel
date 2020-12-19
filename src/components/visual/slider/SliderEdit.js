import React from "react";
import Header from "../../partial/Header";
import SideBar from "../../partial/SideBar";
import API from "../../../services/api/API";
import firebase from "../../../services/firebase/Firebase";
import swal from "sweetalert";
import { EatLoading } from "react-loadingg";

const Loading = () => <EatLoading />;

class SliderEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        firstTitle: "",
        secondTitle: "",
        buttonValue: "",
        content: "",
      },
      image: "",
      errors: {
        files: "",
      },
      files: "",
      isLoading: false,
    };
  }

  textChange = (e) => {
    const { formData } = this.state;

    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.value,
      },
    });
  };

  fileChange = (files) => {
    const url = URL.createObjectURL(files[0]);

    this.setState({
      files: files,
      errors: {
        files: false,
      },
      image: url
    });


  };

  fileUpload = (id) => {
    if (this.state.files !== "" || this.state.files !== "") {
      this.setState({
        isLoading: true,
      });
      const fileName = this.state.files[0].name;

      let bucketName = "visual/slider/" + id + "/";
      let file = this.state.files[0];
      let storageRef = firebase.storage().ref(bucketName + "/" + fileName);

      let uploadTask = storageRef.put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              break;
          }
        },
        (error) => {
          console.log(error + "Hata");
        },
        () => {
          let downloadURL = uploadTask.snapshot.downloadURL;
          this.getFileUrl(id, fileName);
        }
      );
    }
  };

  getFileUrl = (id, fileName) => {
    let storageRef = firebase.storage().ref();
    let spaceRef = storageRef.child("visual/slider/" + id + "/" + fileName);

    storageRef
      .child("visual/slider/" + id + "/" + fileName)
      .getDownloadURL()
      .then((url) => {
        const params = {
          data: {
            id: id,
            image: url,
          },
          url: "visual/slider/image/put",
        };

        API.request(params)
          .then((res) => {
            const result = res.data;

            if (result.success) {
              this.setState(
                {
                  isLoading: false,
                  image: url,
                  formData: {
                    firstTitle: "",
                    secondTitle: "",
                    buttonValue: "",
                    content: "",
                    files: '',
                    errors: {
                      files: "",
                    },
                  },
                },
                () => swal("Başarılı", "Slider Güncellendi !", "success")
              );
            } else {
              this.setState(
                {
                  isLoading: false,
                },
                () => swal("Başarısız", "Slider Güncellenemedi !", "error")
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let { formData } = this.state;
    const id = this.props.match.params.id
    formData.id = id;

    const params = {
      data: formData,
      url: "visual/slider/edit",
    };

    API.request(params)
      .then((res) => {
        const result = res.data;

        if (result.success) {

          if(this.state.files !== ""){
              this.fileUpload(this.props.match.params.id);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchData = (id) => {
    const params = {
      data: {
        id: id,
      },
      url: "visual/slider/where",
    };

    API.request(params)
      .then((res) => {
        const result = res.data;

        if (result.success) {
          const data = result.data;

          this.setState({
            formData: {
              firstTitle: data.TitleFirst,
              secondTitle: data.TitleSecond,
              buttonValue: data.ButtonText,
              content: data.Content,
            },
            image: data.Image,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount = () => {
    const id = this.props.match.params.id;
    this.fetchData(id);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <React.Fragment>
          <Header USER_INFO={this.props.USER_INFO} />
          <SideBar USER_INFO={this.props.USER_INFO} />

          <Loading />
        </React.Fragment>
      );
    }
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
                    <h4 className="mb-0">Görsel Yönetimi</h4>
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
                    <h4 className="card-title">Slider Oluştur</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <form onSubmit={(e) => this.handleSubmit(e)}>
                            <label>Slider 1.Başlık</label>
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
                                value={this.state.formData.firstTitle}
                                name="firstTitle"
                                className="form-control"
                                placeholder="Slider 1. Başlık"
                              />
                            </div>

                            <label>Slider 2.Başlık</label>
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
                                value={this.state.formData.secondTitle}
                                onChange={this.textChange}
                                name="secondTitle"
                                className="form-control"
                                placeholder="Slider 2. Başlık"
                              />
                            </div>

                            <label>Slider Buton Metni</label>
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
                                value={this.state.formData.buttonValue}
                                name="buttonValue"
                                className="form-control"
                                placeholder="Slider buton metni"
                              />
                            </div>

                            <label htmlFor="exampleFormControlTextarea1">
                              Slider İçerik Yazısı
                            </label>
                            <div className="input-group mb-3">
                              <textarea
                                name="content"
                                onChange={this.textChange}
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows={3}
                                defaultValue={this.state.formData.content}
                              />
                            </div>
                            <div className="input-group mb-3">
                              <label
                                htmlFor="slider-img"
                                className="file-upload btn btn-warning btn-block"
                              >
                                <i className="fa fa-upload mr-2" />
                                Resim Seçiniz
                                <input
                                  id="slider-img"
                                  onChange={(e) =>
                                    this.fileChange(e.target.files)
                                  }
                                  type="file"
                                />
                              </label>
                            </div>

                            {this.state.errors.files && (
                              <div className="validError">
                                Resim yüklemelisiniz
                              </div>
                            )}

                            <div className="input-group mb-3 mt-3">
                              <button
                                type="submit"
                                className="mb-3 btn btn-primary"
                              >
                                OLUŞTUR
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6 mt-3">
                <div className="card category-form">
                  <div className="card-header">
                    <h4 className="card-title">Slider Önizleme</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <img id="slider-preview" src={this.state.image} />
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

export default SliderEdit;
