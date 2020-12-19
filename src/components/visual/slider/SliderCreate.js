import React from "react";
import Header from "../../partial/Header";
import SideBar from "../../partial/SideBar";
import API from "../../../services/api/API";
import firebase from "../../../services/firebase/Firebase";
import swal from "sweetalert";
import { EatLoading } from "react-loadingg";

const Loading = () => <EatLoading />;

class SliderCreate extends React.Component {
  tempPreview =
    "https://firebasestorage.googleapis.com/v0/b/pixorion-c4b6f.appspot.com/o/noimage%2Fnoimage.jpg?alt=media&token=499cb4eb-c61c-417a-8625-9dfc7d8c190f";
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        firstTitle: "",
        secondTitle: "",
        buttonValue: "",
        content: "",
      },
      errors: {
        files: "",
      },
      files: null,
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
    this.setState({
      files: files,
      errors: {
        files: false,
      },
    });

    let el = document.getElementById("slider-preview");

    el.src = URL.createObjectURL(files[0]);
  };

  fileUpload = (id) => {
    if (this.state.files !== null || this.state.files !== "") {
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
                  formData: {
                    firstTitle: "",
                    secondTitle: "",
                    buttonValue: "",
                    content: "",
                    files: null,
                    errors: {
                      files: "",
                    },
                  },
                },
                () => swal("Başarılı", "Slider eklendi !", "success")
              );
            } else {
              this.setState(
                {
                  isLoading: false,
                },
                () => swal("Başarısız", "Slider eklenemedi !", "error")
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

    if (this.state.errors.files === false) {
      const { formData } = this.state;

      const params = {
        data: formData,
        url: "visual/slider/create",
      };

      API.request(params)
        .then((res) => {
          const result = res.data;

          if (result.success) {
            const data = result.data;
            this.fileUpload(data.Id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState({
        errors: {
          files: true,
        },
      });
    }
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
                                defaultValue={""}
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
                          <img id="slider-preview" src={this.tempPreview} />
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

export default SliderCreate;
