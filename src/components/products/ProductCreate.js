import React from "react";
import Header from "../partial/Header";
import SideBar from "../partial/SideBar";
import CategoryServices from "../../services/category/CategoryServices";
import CKEditor from "ckeditor4-react";
import firebase from "../../services/firebase/Firebase";
import swal from "sweetalert";
import { EatLoading } from "react-loadingg";

const Loading = () => <EatLoading />;

class ProductCreate extends React.Component {
  fileObj = []; // Resmin ilk halini tutar
  fileArray = []; // Resmin urlsini tutar
  noImage = 'https://firebasestorage.googleapis.com/v0/b/pixorion-c4b6f.appspot.com/o/products%2Fnoimage%2Fno-image.png?alt=media&token=ef9495e4-2443-4028-8701-3664d57dedf4';

  constructor(props) {
    super(props);

    this.state = {
      parentList: [],
      subList: [],
      subSubList: [],
      parentValue: "",
      subValue: "",
      subSubValue: "",
      variationsGroup: [],
      variationsList: [],
      selectedVariations: [],
      color: "",
      tabMenu: "",
      coverPhoto: "",
      file: [null],
      productName: "",
      productNormalPrice: "",
      productDiscountPrice: "",
      feautures: "",
      description: "",
      variationGroupValue: '',
      errors: {
        parentValue: "",
        subValue: "",
        subSubValue: "",
        selectedVariations: [],
        productName: "",
        productNormalPrice: "",
      },
      isLoading: false,
    };

    this.handleVariants = this.handleVariants.bind(this);
    this.tabChange = this.tabChange.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
  }

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

  fileUpload = (PRODUCT_ID) => {
    if (this.state.coverPhoto !== null || this.state.coverPhoto !== "") {
      this.setState({
        isLoading: true,
      });
      const fileName = this.state.coverPhoto[0].name;

      let bucketName = "products/" + PRODUCT_ID + "/cover";
      let file = this.state.coverPhoto[0];
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
          this.getFileUrl(PRODUCT_ID, fileName);
          this.setState({
            isLoading: false,
          });
        }
      );
    }
  };

  getFileUrl = (productId, fileName) => {
    let storageRef = firebase.storage().ref();
    let spaceRef = storageRef.child(
      "products/" + productId + "/cover/" + fileName
    );

    storageRef
      .child("products/" + productId + "/cover/" + fileName)
      .getDownloadURL()
      .then((url) => {
        let params = {
          data: {
            id: productId,
            picture: url,
          },
          url: "product/cover/put",
        };

        CategoryServices.sendRequest(params)
          .then((response) => {
            let result = response.data;
            if (result.success) {
              swal("Başarılı!", "Yeni Ürün Eklendi!", "success");
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

  getMultipleFileUrl = (productId, fileName) => {
    let urls = [];

    let storageRef = firebase.storage().ref();
    let spaceRef = storageRef.child(
      "products/" + productId + "/list/" + fileName
    );

    storageRef
      .child("products/" + productId + "/list/" + fileName)
      .getDownloadURL()
      .then((url) => {
        let params = {
          data: {
            id: productId,
            url: url,
          },
          url: "product/images/create",
        };

        CategoryServices.sendRequest(params)
          .then((response) => {
            this.fileArray = [];
            this.fileObj = [];
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  multipleFileUpload = (id) => {
    let imageList = [];
    let i = 0;
    for (i; i < this.fileObj.length; i++) {
      const fileName = this.fileObj[i].name;
      imageList.push(fileName);

      let bucketName = "products/" + id + "/list";
      let file = this.fileObj[i];
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
          this.getMultipleFileUrl(id, fileName);
        }
      );
    }
  };

  handleSubmit = () => {
    const formData = this.state;
    const errors = formData.errors;

    const fields = {
      parentValue: formData.parentValue,
      subValue: formData.subValue,
      subSubValue: formData.subSubValue,
      selectedVariations: formData.selectedVariations,
      productName: formData.productName,
      productNormalPrice: formData.productNormalPrice,
    };

    let validResult = this.fieldsValid(fields, errors);
    if (validResult) {
      const params = {
        data: {
          productName: this.state.productName,
          productNormalPrice: this.state.productNormalPrice,
          productDiscountPrice: this.state.productDiscountPrice,
          productFeautures: this.state.feautures,
          productDescription: this.state.description,
          parentCategory: this.state.parentValue,
          subCategory: this.state.subValue,
          subSubCategory: this.state.subSubValue,
          variations: this.state.selectedVariations,
          variationGroupValue: this.state.variationGroupValue,
          color: this.state.color,
        },
        url: "product/create",
      };

      CategoryServices.sendRequest(params)
        .then((response) => {
          const result = response.data;

          if (result.success) {
            const id = result.data.Id;
            if (this.state.coverPhoto !== "") {
              this.fileUpload(id);
            } else {
              swal("Başarılı!", "Yeni Ürün Eklendi!", "success");
            }

            if (this.fileObj.length > 0) {
              this.multipleFileUpload(id);
            }
            this.setState({
              parentValue: "",
              subValue: "",
              subSubValue: "",
              color: "",
              productName: "",
              productNormalPrice: "",
              productDiscountPrice: "",
              productDescription: "",
              productFeautures: "",
              selectedVariations: [],
              subList: [],
              subSubList: []
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  parentCategories = () => {
    const params = {
      data: {},
      url: "category/main/list",
    };

    CategoryServices.sendRequest(params)
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

  parentChange = (e) => {
    const selected = parseInt(e.target.value);

    if (selected !== 0) {
      const params = {
        data: {
          value: selected,
        },
        url: "category/sub/get",
      };

      CategoryServices.sendRequest(params)
        .then((response) => {
          const result = response.data;

          if (result.success) {
            const data = result.data;

            this.setState({
              subList: data,
              parentValue: selected,
            });
          } else {
            this.setState({
              subList: [],
              subValue: "",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        subList: [],
        subValue: "",
        parentValue: "",
      });
    }
  };

  subChange = (e) => {
    const selected = parseInt(e.target.value);

    if (selected !== 0) {
      const params = {
        data: {
          value: selected,
        },
        url: "category/sub/get/sub",
      };

      CategoryServices.sendRequest(params)
        .then((response) => {
          const result = response.data;
          if (result.success) {
            const data = result.data;

            this.setState({
              subSubList: data,
              subValue: selected,
            });
          } else {
            this.setState({
              subSubList: [],
              subSubValue: "",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        subSubList: [],
        subSubValue: "",
        subValue: "",
      });
    }
  };

  subSubChange = (e) => {
    const selected = parseInt(e.target.value);

    if (selected !== 0) {
      this.setState({
        subSubValue: selected,
      });
    } else {
      this.setState({
        subSubValue: "",
      });
    }
  };

  variationsGroupFetch = () => {
    const params = {
      data: {},
      url: "variations/group/get",
    };

    CategoryServices.sendRequest(params)
      .then((response) => {
        const result = response.data;

        if (result.success) {
          const data = result.data;
          this.setState({
            variationsGroup: data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  variationsGroupChange = (e) => {
    const selected = parseInt(e.target.value);

    if (selected !== 0) {
      const params = {
        data: {
          value: selected,
        },
        url: "variations/where",
      };

      CategoryServices.sendRequest(params)
        .then((response) => {
          const result = response.data;

          if (result.success) {
            const data = result.data;

            this.setState({
              variationGroupValue: selected,
              variationsList: data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  handleVariants = (e) => {
    const selected = parseInt(e.target.value);

    let all = [];

    if (e.target.checked === true) {
      all = this.state.selectedVariations.concat();
      all.push(selected);
      this.setState({
        selectedVariations: all,
      });
    } else {
      all = this.state.selectedVariations.concat();

      const index = all.indexOf(selected);

      if (index > -1) {
        all.splice(index, 1);

        this.setState({
          selectedVariations: all,
        });
      }
    }
  };

  tabChange = (tab) => {
    this.setState({
      tabMenu: tab,
    });
  };

  handleColor = (e) => {
    this.setState({
      color: e.target.value,
    });
  };

  coverPhotoChange = (files) => {
    this.setState({
      coverPhoto: files,
    });

    document.getElementById("cover-photo").src = URL.createObjectURL(files[0]);
  };

  componentDidMount = () => {
    this.parentCategories();
    this.variationsGroupFetch();
  };

  feauturesChange = (e) => {
    const data = e.editor.getData();

    this.setState({
      feautures: data,
    });
  };

  descChange = (e) => {
    const data = e.editor.getData();

    this.setState({
      description: data,
    });
  };

  uploadMultipleFiles = (e) => {
    for (let x = 0; x < e.target.files.length; x++) {
      this.fileObj.push(e.target.files[x]);
    }
    this.fileArray = [];
    for (let y = 0; y < this.fileObj.length; y++) {
      this.fileArray.push(URL.createObjectURL(this.fileObj[y]));
    }

    this.setState({
      file: this.fileArray,
    });
  };

  destroyImage = (key) => {
    this.fileArray.splice(key, 1);

    this.fileObj.splice(key, 1);

    if (this.fileArray.length === 0) {
      this.fileArray = [];
    }
  };

  handleProductChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    let style = {};
    const tabMenu = this.state.tabMenu;

    if (tabMenu === "" || tabMenu === "feautures") {
      style.feautures = { display: "block" };
      style.info = { display: "none" };
      style.images = { display: "none" };
    } else if (tabMenu === "info") {
      style.feautures = { display: "none" };
      style.info = { display: "block" };
      style.images = { display: "none" };
    } else if (tabMenu === "images") {
      style.feautures = { display: "none" };
      style.info = { display: "none" };
      style.images = { display: "block" };
    }

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
              <div className="col-12 col-lg-8 mt-3  align-self-center">
                <div className="sub-header mt-3 py-3 px-3 align-self-center d-sm-flex w-100 rounded">
                  <div className="w-sm-100 mr-auto">
                    <h4 className="mb-0">Ürün Yönetimi</h4>
                  </div>
                </div>
                <div className="profile-menu mt-4 theme-background border border-left-0 border-right-0 z-index-1 p-2">
                  <div className="d-sm-flex">
                    <div className="align-self-center">
                      <ul
                        className="nav nav-pills flex-column flex-sm-row"
                        id="myTab"
                        role="tablist"
                      >
                        <li className="nav-item ml-0">
                          <a
                            className="nav-link py-2 px-3 px-lg-4 active"
                            data-toggle="tab"
                            href="#feautures"
                            onClick={() => this.tabChange("feautures")}
                          >
                            Genel Özellikler
                          </a>
                        </li>
                        <li className="nav-item ml-0">
                          <a
                            className="nav-link py-2 px-4 px-lg-4"
                            data-toggle="tab"
                            href="#info"
                            onClick={() => this.tabChange("info")}
                          >
                            Ürün Bilgileri
                          </a>
                        </li>
                        <li className="nav-item ml-0">
                          <a
                            className="nav-link py-2 px-4 px-lg-4"
                            data-toggle="tab"
                            href="#images"
                            onClick={() => this.tabChange("images")}
                          >
                            Ürün Resimleri
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="align-self-center ml-auto text-center text-sm-right">
                      <a href="#">
                        <button
                          type="submit"
                          onClick={() => this.handleSubmit()}
                          className="btn btn-info mb-2"
                        >
                          <i className="fa fa-check" /> YAYINLA
                        </button>
                      </a>
                    </div>
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
                    <h4 className="card-title">Ürün Kapak Resmi</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <label
                            htmlFor="coverPhotoFile"
                            className="file-upload btn btn-warning btn-block"
                          >
                            <i className="fa fa-upload mr-2" />
                            Kapak Resmi Seçiniz
                            <input
                              onChange={(e) =>
                                this.coverPhotoChange(e.target.files)
                              }
                              id="coverPhotoFile"
                              type="file"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3 mt-3 preview-cover">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Kapak Resmi Önizleme</h4>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="cover-capsule">
                            <img src={this.noImage} id="cover-photo" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-lg-8 mt-3">
                <div className="card category-form">
                  <div className="card-header">
                    <h4 className="card-title">Ürün Ekle</h4>
                  </div>

                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <form>
                            <div style={style.feautures}>
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
                                    {this.state.parentList.map(
                                      (parent, key) => (
                                        <option value={parent.Id} key={key}>
                                          {parent.Name}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  {this.state.errors.parentValue && (
                                    <div className="validError">
                                      {this.state.errors.parentValue}
                                    </div>
                                  )}
                                </div>
                              )}

                              {this.state.subList.length > 0 && (
                                <div className="input-group mb-3">
                                  <select
                                    onChange={this.subChange}
                                    className="form-control"
                                  >
                                    <option value="0">
                                      Alt Kategori Seçiniz
                                    </option>
                                    {this.state.subList.map((sub, key) => (
                                      <option value={sub.Id} key={key}>
                                        {sub.Name}
                                      </option>
                                    ))}
                                  </select>
                                  {this.state.errors.subValue && (
                                    <div className="validError">
                                      {this.state.errors.subValue}
                                    </div>
                                  )}
                                </div>
                              )}

                              {this.state.subSubList.length > 0 && (
                                <div className="input-group mb-3">
                                  <select
                                    className="form-control"
                                    onChange={this.subSubChange}
                                  >
                                    <option value="0">
                                      Alt Kategori Seçiniz
                                    </option>

                                    {this.state.subSubList.map(
                                      (subsub, key) => (
                                        <option value={subsub.Id} key={key}>
                                          {subsub.Name}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  {this.state.errors.subSubValue && (
                                    <div className="validError">
                                      {this.state.errors.subSubValue}
                                    </div>
                                  )}
                                </div>
                              )}

                              <label htmlFor="mainCategory">
                                Varyasyon Grubu Seçiniz
                              </label>
                              {this.state.variationsGroup.length > 0 && (
                                <div className="input-group">
                                  <select
                                    onChange={this.variationsGroupChange}
                                    className="form-control"
                                  >
                                    <option value="0">
                                      Varyasyon Grubu Seçiniz
                                    </option>
                                    {this.state.variationsGroup.map(
                                      (v, key) => (
                                        <option value={v.Id} key={key}>
                                          {v.Name}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  {this.state.errors.selectedVariations && (
                                    <div className="validError">
                                      {this.state.errors.selectedVariations}
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="card-body">
                                {this.state.variationsList.length > 0 &&
                                  this.state.variationsList.map((v, key) => (
                                    <div className="custom-control custom-checkbox custom-control-inline">
                                      <input
                                        onChange={this.handleVariants}
                                        type="checkbox"
                                        value={v.Id}
                                        className="custom-control-input"
                                        id={"customCheck" + key}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={"customCheck" + key}
                                      >
                                        {v.Name}
                                      </label>
                                    </div>
                                  ))}
                              </div>

                              <label htmlFor="username">Ürün Rengi</label>

                              <div className="input-group mb-3">
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
                                  name="color"
                                  className="form-control"
                                  placeholder="Ürün Rengi"
                                  value={this.state.color}
                                  onChange={this.handleColor}
                                />
                              </div>
                            </div>
                            <div style={style.info}>
                              <label htmlFor="username">Ürün Adı</label>

                              <div className="input-group mb-3">
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
                                  name="productName"
                                  className="form-control"
                                  onChange={this.handleProductChange}
                                  placeholder="Ürün Adı"
                                />
                                {this.state.errors.productName && (
                                  <div className="validError">
                                    {this.state.errors.productName}
                                  </div>
                                )}
                              </div>

                              <label htmlFor="username">
                                Ürün Normal Fiyatı
                              </label>

                              <div className="input-group mb-3">
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
                                  name="productNormalPrice"
                                  onChange={this.handleProductChange}
                                  className="form-control"
                                  placeholder="Ürün Fiyatı"
                                />
                                {this.state.errors.productNormalPrice && (
                                  <div className="validError">
                                    {this.state.errors.productNormalPrice}
                                  </div>
                                )}
                              </div>

                              <label htmlFor="username">
                                Ürün İndirimli Fiyatı
                              </label>

                              <div className="input-group mb-3">
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
                                  name="productDiscountPrice"
                                  onChange={this.handleProductChange}
                                  className="form-control"
                                  placeholder="Ürün İndirimli Fiyatı"
                                />
                              </div>

                              <label htmlFor="username">Ürün Özellikleri</label>
                              <div className="input-group mb-3">
                                <CKEditor
                                  onChange={this.feauturesChange}
                                  data=""
                                />
                              </div>

                              <label htmlFor="username">Ürün Açıklaması</label>
                              <div className="input-group mb-3">
                                <CKEditor onChange={this.descChange} data="" />
                              </div>
                            </div>
                            {/**IMAGES */}
                            <div style={style.images}>
                              <div className="input-group mb-3">
                                <div className="main-area">
                                  <input
                                    onChange={this.uploadMultipleFiles}
                                    type="file"
                                    multiple
                                  />
                                  <p>Resimleri buraya sürükleyin.</p>
                                </div>

                                {/** / IMAGES */}
                              </div>
                              <div className="multiple-capsule col-12">
                                {this.fileArray.length > 0 &&
                                  this.fileArray.map((file, key) => (
                                    <div className="image-col col-3">
                                      <div className="image-group input-group mb-3">
                                        <a
                                          onClick={() => this.destroyImage(key)}
                                          className="remove-image"
                                          href="#0"
                                        >
                                          <i className="fas fa-window-close"></i>
                                        </a>
                                        <img
                                          className="image-parent"
                                          key={key}
                                          src={file}
                                        />
                                      </div>
                                    </div>
                                  ))}
                              </div>
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

export default ProductCreate;
