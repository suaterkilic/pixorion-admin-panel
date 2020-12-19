import React from "react";
import Header from "../partial/Header";
import SideBar from "../partial/SideBar";
import API from "../../services/api/API";
import swal from "sweetalert";
import firebase from '../../services/firebase/Firebase';

class MainEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      error: false,
      picture: "",
      files: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  generateRandomName = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  renameFile = (originalFile, newName) => {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  };

  formValid = () => {
    if (this.state.name === "") {
      this.setState({
        error: true,
      });

      return true;
    } else {
      this.setState({
        error: false,
      });

      return false;
    }
  };

  handleFileChange = (files) => {
    this.setState({
      files: files,
    });

    document.getElementById("profile-preview").src = URL.createObjectURL(
      files[0]
    );
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleGetFileUrl = (id, fileName) => {
    let storageRef = firebase.storage().ref();
    let spaceRef = storageRef.child("categories/main/" + id + "/" + fileName);

    storageRef
      .child("categories/main/" + id + "/" + fileName)
      .getDownloadURL()
      .then((url) => {
        let params = {
          data: {
            id: id,
            picture: url,
          },
          url: "category/main/picture/update",
        };

        API.request(params)
          .then((response) => {
            let result = response.data;
            if (result.success) {
              swal("Başarılı!", "Yeni Kategori Oluşturuldu!", "success");
            } else {
              swal("Başarısız!", "Yeni Kategori Oluşturulamadı!", "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleFileUpload = (id) => {
    if (this.state.files !== null) {
      const fileName = this.state.files[0].name;

      let randomName = this.generateRandomName(15);
      let newName = this.renameFile(fileName, randomName);
      let bucketName = "categories/main/" + id;
      let file = this.state.files[0];
      let storageRef = firebase.storage().ref(bucketName + "/" + randomName);

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
              console.log("Upload is running" + progress);
              break;
          }
        },
        (error) => {
          console.log(error + "Hata");
        },
        () => {
          let downloadURL = uploadTask.snapshot.downloadURL;
          this.handleGetFileUrl(id, randomName);
        }
      );
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let isValid = this.formValid();

    if (!isValid) {
      const ID = this.props.match.params.id;

      let params = {
        data: {
          id: ID,
          name: this.state.name,
        },
        url: "category/main/update",
      };

      API.request(params)
        .then((response) => {
          let result = response.data;

          if (result.success) {
            if(this.state.files !== null){
              this.handleFileUpload(ID);
            }
          } else {
            swal("Başarısız!", "Ana Kategori Güncellenemedi!", "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  componentDidMount = () => {
    const ID = this.props.match.params.id;

    let params = {
      data: {
        id: ID,
      },
      url: "category/main/id",
    };

    API.request(params)
      .then((response) => {
        let result = response.data;
        let category = result.data;

        if (result.success) {
          this.setState({
            name: category.Name,
            picture: category.Picture,
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
        <Header USER_INFO={this.props.USER_INFO} />
        <SideBar USER_INFO={this.props.USER_INFO} />
        <main>
          <div className="container-fluid">
            {/* START: Breadcrumbs*/}
            <div className="row ">
              <div className="col-12  align-self-center">
                <div className="sub-header mt-3 py-3 px-3 align-self-center d-sm-flex w-100 rounded">
                  <div className="w-sm-100 mr-auto">
                    <h4 className="mb-0">Ana Kategori Yönetimi</h4>
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
                    <h4 className="card-title">Ana Kategori Güncelle</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <form onSubmit={(e) => this.handleSubmit(e)}>
                            <label htmlFor="username">Ana Kategori Adı</label>
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
                                name="name"
                                onChange={this.handleChange}
                                value={this.state.name}
                                className="form-control"
                                placeholder="Ana Kategori Adı"
                              />
                              {this.state.error && (
                                <div className="validError">
                                  Kategori alanı boş geçilemez
                                </div>
                              )}
                            </div>

                            <label
                              for="fileUpload"
                              class="file-upload btn btn-info btn-block"
                            >
                              <i class="fa fa-upload mr-2"></i>Kategori Resmi
                              Seçiniz
                              <input
                                id="fileUpload"
                                type="file"
                                onChange={(e) =>
                                  this.handleFileChange(e.target.files)
                                }
                              />
                            </label>
                            <div className="form-group">
                              <button type="submit" className="btn btn-primary">
                                Güncelle
                              </button>{" "}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 mt-3">
                <div className="card">
                  <img
                    id="profile-preview"
                    className="card-img-top"
                    src={this.state.picture}
                    alt="Card image cap"
                  />
                  <div className="card-body bg-primary">
                    <div className="media d-block text-left py-4 text-white">
                      <h5 className="admin-authority">{this.state.name}</h5>
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

export default MainEdit;
