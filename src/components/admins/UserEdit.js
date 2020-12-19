import React from "react";
import Header from "../partial/Header";
import SideBar from "../partial/SideBar";
import API from '../../services/api/API';
import firebase from "../../services/firebase/Firebase";
import swal from "sweetalert";

class UserEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      files: null,
      formData: {
        name: "",
        surname: "",
        username: "",
        password: "",
        authority: "",
      },
      errors: {
        name: "",
        surname: "",
        username: "",
        password: "",
        authority: "",
      },
      picture: "",
    };
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

  handleTextChange = (e) => {
    const { formData } = this.state;

    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.value,
      },
    });
  };

  fieldsValid = (data, errors) => {
    const errorMsg = "Bu alan boş geçilemez";
    const keys = Object.keys(data);

    let i = 0;

    for (const key of keys) {
      if (data[key].length == 0) {
        errors[key] = errorMsg;
        i++;
      } else {
        errors[key] = "";
      }
    }
    this.setState({
      errors: errors,
    });

    if (i == 0) {
      return true;
    } else {
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

  handleReset = () => {
    this.setState({
      formData: {
        name: "",
        surname: "",
        username: "",
        password: "",
        authority: "",
      },
      errors: {
        name: "",
        surname: "",
        username: "",
        password: "",
        authority: "",
      },

      files: null,
      isAdded: false,
    });

    //document.getElementById("fileUpload").value = null;
  };

  handleFileUpload = (USER_ID) => {
    if (this.state.files !== null) {
      const fileName = this.state.files[0].name;

      let randomName = this.generateRandomName(15);
      let newName = this.renameFile(fileName, randomName);
      let bucketName = "admin/users/profile/pictures/" + USER_ID;
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
          this.handleGetFileUrl(USER_ID, randomName);
        }
      );
    }
  };

  handleGetFileUrl = (USER_ID, fileName) => {
    let storageRef = firebase.storage().ref();
    let spaceRef = storageRef.child(
      "admin/users/profile/pictures/" + USER_ID + "/" + fileName
    );

    storageRef
      .child("admin/users/profile/pictures/" + USER_ID + "/" + fileName)
      .getDownloadURL()
      .then((url) => {
        let params = {
          data: {
            id: USER_ID,
            picture: url,
          },
          url: "admin/user/picture/update",
        };

        API.putPicture(params)
          .then((response) => {
            let result = response.data;

            if (result.success) {
              swal("Başarılı!", "Admin Güncellendi!", "success");
            } else {
              swal("Başarısız!", "İşlem Yapılamadı!", "error");
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

  handleSubmit = (e) => {
    e.preventDefault();

    const { formData, errors } = this.state;
    const { name, surname, username, password, authority } = formData;

    const fields = {
      name: name,
      surname: surname,
      username: username,
      password: password,
      authority: authority,
    };

    let validResult = this.fieldsValid(fields, errors);

    if (validResult) {
      let params = {
        data: {
          id: this.state.id,
          name: this.state.formData.name,
          surname: this.state.formData.surname,
          username: this.state.formData.username,
          authority: this.state.formData.authority,
          password: this.state.formData.password,
        },
        url: "admin/user/update",
      };

      API.request(params)
        .then((response) => {
          let result = response.data;
          let userData = result.data;
          if (result.success) {
            this.setState({
              formData: {
                name: userData.Name,
                surname: userData.Surname,
                username: userData.Username,
                password: userData.Password,
                authority: userData.Authority,
              },
            });

            if (this.state.files !== null) {
              const USER_ID = userData.Id;
              this.handleFileUpload(USER_ID);
            } else {
              swal("Başarılı!", "Admin Güncellendi!", "success");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  componentDidMount = () => {
    const userId = this.props.match.params.id;
    let params = {
      data: {
        id: userId,
      },
      url: "admin/user/id",
    };

    API.userFetch(params)
      .then((response) => {
        let result = response.data;
        let userData = result.data;

        if (result.success) {
          this.setState({
            formData: {
              name: userData.Name,
              surname: userData.Surname,
              username: userData.Username,
              password: userData.Password,
              authority: userData.Authority,
            },
            picture: userData.ProfilePicture,
            id: userData.Id,
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
                    <h4 className="mb-0">Admin Düzenle</h4>
                  </div>
                </div>
              </div>
            </div>
            {/* END: Breadcrumbs*/}
            {/* START: Card Data*/}

            <div className="row">
              <div className="col-12 col-lg-6 mt-3">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Admin Güncelleme Formu </h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <form
                            action="javascript:void(0);"
                            onSubmit={(e) => this.handleSubmit(e)}
                          >
                            <label htmlFor="validationCustom03">Ad</label>
                            <div className="input-group  mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text bg-transparent border-right-0"
                                  id="basic-addon1"
                                >
                                  <i className="icon-user" />
                                </span>
                              </div>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Adı"
                                name="name"
                                id="validationCustom03"
                                onChange={this.handleTextChange}
                                value={this.state.formData.name}
                              />
                              {this.state.errors.name && (
                                <div className="validError">
                                  {this.state.errors.name}
                                </div>
                              )}
                            </div>

                            <label htmlFor="validationCustom02">Soyad</label>
                            <div className="input-group  mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text bg-transparent border-right-0"
                                  id="basic-addon1"
                                >
                                  <i className="icon-user" />
                                </span>
                              </div>
                              <input
                                type="text"
                                id="validationCustom02"
                                className="form-control"
                                placeholder="Soyadı"
                                name="surname"
                                onChange={this.handleTextChange}
                                value={this.state.formData.surname}
                              />
                              {this.state.errors.surname && (
                                <div className="validError">
                                  {this.state.errors.surname}
                                </div>
                              )}
                            </div>

                            <label htmlFor="username">Kullanıcı Adı</label>
                            <div className="input-group  mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text bg-transparent border-right-0"
                                  id="basic-addon1"
                                >
                                  <i className="icon-user" />
                                </span>
                              </div>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Kullanıcı adı"
                                name="username"
                                onChange={this.handleTextChange}
                                value={this.state.formData.username}
                              />
                              {this.state.errors.username && (
                                <div className="validError">
                                  {this.state.errors.username}
                                </div>
                              )}
                            </div>

                            <label htmlFor="username">Yetki</label>
                            <div className="input-group  mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text bg-transparent border-right-0"
                                  id="basic-addon1"
                                >
                                  <i className="icon-user" />
                                </span>
                              </div>
                              {this.state.formData.authority === "manager" ? (
                                <input
                                  disabled
                                  type="text"
                                  className="form-control"
                                  placeholder="Yetki"
                                  name="authority"
                                  onChange={this.handleTextChange}
                                  value={this.state.formData.authority}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Yetki"
                                  name="authority"
                                  onChange={this.handleTextChange}
                                  value={this.state.formData.authority}
                                />
                              )}
                              {this.state.errors.authority && (
                                <div className="validError">
                                  {this.state.errors.authority}
                                </div>
                              )}
                            </div>

                            <label htmlFor="username">Şifre</label>
                            <div className="input-group mb-3">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text bg-transparent border-right-0"
                                  id="basic-password"
                                >
                                  <i className="icon-options" />
                                </span>
                              </div>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Şifre"
                                name="password"
                                onChange={this.handleTextChange}
                                value={this.state.formData.password}
                              />
                              {this.state.errors.password && (
                                <div className="validError">
                                  {this.state.errors.password}
                                </div>
                              )}
                            </div>

                            <label
                              for="fileUpload"
                              class="file-upload btn btn-info btn-block"
                            >
                              <i class="fa fa-upload mr-2"></i>Profil Resmi
                              Seçiniz ...
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
                                Kaydet
                              </button>{" "}
                              <button
                                type="button"
                                className="btn btn-outline-warning"
                                onClick={() => this.handleReset()}
                              >
                                Reset
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
                <div className="card">
                  <img
                    className="card-img-top"
                    src="/dist/images/chip.jpg"
                    alt="Card image cap"
                  />
                  <div className="card-body bg-primary">
                    <div className="media d-block text-left py-4 text-white">
                      <div className="media-body align-self-center mt-0 d-flex">
                        <img
                          className="rounded-circle mr-2"
                          src={this.state.picture}
                          alt=""
                          id="profile-preview"
                          width={35}
                          height={35}
                        />
                        <div className="message-content">
                          <h6 className="mb-0 font-weight-bold">
                            {this.state.formData.name +
                              " " +
                              this.state.formData.surname}
                          </h6>
                          <p>{"@" + this.state.formData.username} </p>
                        </div>
                      </div>
                      <h5 className="admin-authority">
                        {this.state.formData.authority}
                      </h5>
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

export default UserEdit;
