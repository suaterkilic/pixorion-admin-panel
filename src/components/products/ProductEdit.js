import React from "react";
import Header from "../partial/Header";
import SideBar from "../partial/SideBar";
import CKEditor from "ckeditor4-react";
import API from "../../services/api/API";
import firebase from "../../services/firebase/Firebase";
import swal from "sweetalert";
import { EatLoading } from "react-loadingg";

const Loading = () => <EatLoading />;

class ProductEdit extends React.Component {
  fileArray = [];
  fileObj = [];

  constructor(props) {
    super(props);

    this.state = {
      parentChange: false,
      isMultiple: false,
      subChange: false,
      isLoading: false,
      newImgList: [],
      parentList: [],
      subList: [],
      subSubList: [],
      parentValue: "",
      subValue: "",
      subSubValue: "",
      product: {},
      variationsGroup: [],
      childVariations: [],
      sizeList: [],
      tabMenu: "",
      selectedSizes: [],
      productName: "",
      productNormalPrice: "",
      productDiscountPrice: "",
      feautures: "",
      description: "",
      color: "",
      firstImgList: [],
      coverPhoto: "",
      vGroupId: "",
      errors: {
        parentValue: "",
        subValue: "",
        subSubValue: "",
        selectedSizes: [],
        productName: "",
        productNormalPrice: "",
      },
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
  }

  destroyImage = (key, type, id, image) => {
    if (type === "firebase") {
      const params = {
        data: {
          id: id,
        },
        url: "product/images/list/destroy",
      };

      API.request(params)
        .then((response) => {
          const result = response.data;

          if (result.success) {
            let imgList = [];
            let firstList = [];

            imgList = this.state.newImgList.concat();
            firstList = this.state.firstImgList.concat();

            imgList.splice(key, 1);
            firstList.splice(key, 1);

            this.setState({
              firstImgList: firstList,
              newImgList: imgList,
            });

            let desertRef = firebase.storage().refFromURL(image);

            desertRef
              .delete()
              .then((res) => {
                console.log(res);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === "file") {
      this.fileObj.splice(key, 1);

      let imageList = this.state.newImgList.concat();

      imageList.splice(key, 1);

      this.setState({
        newImgList: imageList,
      });
    }
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

  uploadImages = () => {
    this.setState({
      isLoading: true,
    });
    const id = this.state.product.Id;
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
          this.setState({
            isLoading: false,
          });
          this.getMultipleFileUrl(id, fileName);
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

        API.request(params)
          .then((response) => {
            let result = response.data;
            if (result.success) {
              if (this.state.isMultiple === false) {
                swal("Başarılı!", "Yeni Ürün Eklendi!", "success");
              }
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

  fileUpload = (PRODUCT_ID) => {
    if (this.state.coverPhoto !== null || this.state.coverPhoto !== "") {
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
        }
      );
    }
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

        API.request(params)
          .then((response) => {
            this.fileArray = [];
            this.fileObj = [];

            this.setState({
              isMultiple: true,
            });

            swal("Başarılı!", "Ürün güncellendi!", "success");
          })
          .catch((error) => {
            swal("Başarısız!", "Ürün güncellenemedi!", "error");
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSubmit = () => {
    const formData = this.state;
    const errors = formData.errors;

    const fields = {
      parentValue: formData.parentValue,
      subValue: formData.subValue,
      subSubValue: formData.subSubValue,
      selectedSizes: formData.selectedSizes,
      productName: formData.productName,
      productNormalPrice: formData.productNormalPrice,
      vGroupId: formData.vGroupId,
    };

    let validResult = this.fieldsValid(fields, errors);

    if (validResult) {
      const params = {
        data: {
          id: this.state.product.Id,
          productName: this.state.productName,
          productNormalPrice: this.state.productNormalPrice,
          productDiscountPrice: this.state.productDiscountPrice,
          productFeautures: this.state.feautures,
          productDescription: this.state.description,
          parentCategory: this.state.parentValue,
          subCategory: this.state.subValue,
          subSubCategory: this.state.subSubValue,
          variations: this.state.selectedSizes,
          variationsGroup: this.state.variationsGroup,
          color: this.state.color,
          vGroupId: this.state.vGroupId,
        },
        url: "product/edit/put",
      };

      API.request(params)
        .then((response) => {
          const result = response.data;

          if (result.success) {
            if (
              this.state.newImgList.length != this.state.firstImgList.length
            ) {
              this.uploadImages();
              console.log("Resimler [] Yüklendi");
            }
            if (this.state.coverPhoto !== "") {
              this.fileUpload(this.state.product.Id);

              console.log("Tek bir resim yüklendi ");
            }
          } else {
            swal("Başarısız!", "Ürün güncellenemedi!", "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  uploadMultipleFiles = (e) => {
    for (let x = 0; x < e.target.files.length; x++) {
      this.fileObj.push(e.target.files[x]);
    }

    let t = [];

    for (let y = 0; y < this.fileObj.length; y++) {
      t.push({
        image: URL.createObjectURL(this.fileObj[y]),
        type: "file",
      });
    }

    let newTemp = [];
    newTemp = this.state.firstImgList.concat(t);

    this.setState({
      newImgList: newTemp,
    });
  };

  fetchProductDetail = (id) => {
    const params = {
      data: {
        value: id,
      },
      url: "product/where",
    };

    API.request(params)
      .then((response) => {
        const result = response.data;
        if (result.success) {
          const PRODUCT = result.data.PRODUCT;
          const PARENT_LIST = result.data.PARENT_CATEGORY;
          const SUB_LIST = result.data.SUB_CATEGORY;
          const SUB_SUB_LIST = result.data.SUB_SUB_CATEGORY;
          const VARIATIONS_SELECTED = result.data.VARIATIONS;
          let IMAGE_LIST = result.data.IMAGE_LIST;

          let sizeList = [];
          sizeList = PRODUCT.ProductSize.split(",");

          let selectedSizes = [];

          VARIATIONS_SELECTED.map((v, key) => {
            if (v.CHECKED === true) {
              selectedSizes.push(v.Id);
            }
          });

          let firstList = [];
          IMAGE_LIST.map((i, k) => {
            firstList.push({
              id: i.Id,
              image: i.Image,
              type: "firebase",
            });
          });

          this.setState({
            parentList: PARENT_LIST,
            subList: SUB_LIST,
            subSubList: SUB_SUB_LIST,
            product: PRODUCT,
            childVariations: VARIATIONS_SELECTED,
            sizeList: sizeList,
            selectedSizes: selectedSizes,
            color: PRODUCT.ProductColor,
            productName: PRODUCT.ProductName,
            productNormalPrice: PRODUCT.ProductNormalPrice,
            productDiscountPrice: PRODUCT.ProductDiscountPrice,
            feautures: PRODUCT.ProductFeatures,
            description: PRODUCT.ProductDescription,
            newImgList: firstList,
            firstImgList: firstList,
            parentValue: PRODUCT.ParentCategoryId,
            subValue: PRODUCT.SubCategoryId,
            subSubValue: PRODUCT.SubSubCategoryId,
            vGroupId: PRODUCT.ProductVariationId,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  parentChange = (e) => {
    this.setState({
      parentChange: true,
    });
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
              subSubList: [],
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
        subSubList: [],
        subSubValue: "",
        subValue: "",
        parentValue: "",
      });
    }
  };

  subChange = (e) => {
    this.setState({
      subChange: true
    })
    const selected = parseInt(e.target.value);

    if (selected !== 0) {
      const params = {
        data: {
          value: selected,
        },
        url: "category/sub/get/sub",
      };

      API.request(params)
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

    API.request(params)
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

  componentDidMount = () => {
    const id = this.props.match.params.id;
    this.fetchProductDetail(id);
    this.variationsGroupFetch();
  };

  handleVariants = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    let temp = [];
    let selected = [];

    temp = this.state.childVariations.concat();
    selected = this.state.selectedSizes.concat();
    const key = temp.findIndex((i) => i.Id == value);

    if (checked) {
      selected.push(value);
      temp[key].CHECKED = true;

      this.setState({
        selectedSizes: selected,
        childVariations: temp,
      });
    } else {
      const index = selected.indexOf(value);
      if (index > -1) {
        selected.splice(index, 1);
      }
      temp[key].CHECKED = false;

      this.setState({
        selectedSizes: selected,
        childVariations: temp,
      });
    }
  };

  variationsGroupChange = (e) => {
    const selected = parseInt(e.target.value);

    if (selected !== 0) {
      this.setState({
        vGroupId: selected,
      });
      const params = {
        data: {
          value: selected,
        },
        url: "variations/where",
      };

      API.request(params)
        .then((response) => {
          const result = response.data;

          if (result.success) {
            const data = result.data;

            this.setState({
              childVariations: data,
              selectedSizes: [],
              sizeList: [],
            });
          } else {
            this.setState({
              childVariations: [],
              selectedSizes: [],
              sizeList: [],
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  tabChange = (tab) => {
    this.setState({
      tabMenu: tab,
    });
  };

  handleTextChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  coverPhotoChange = (files) => {
    this.setState({
      coverPhoto: files,
    });

    document.getElementById("cover-photo").src = URL.createObjectURL(files[0]);
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
    const coverPhoto = this.state.product.ProductCoverPhoto;
    return (
      <React.Fragment>
        <Header USER_INFO={this.props.USER_INFO} />
        <SideBar USER_INFO={this.props.USER_INFO} />
        <main>
          <div className="container-fluid">
            {/** TAB MENU START */}
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
                          <i className="fa fa-check" /> GÜNCELLE
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/** TAB MENU END */}
            {/** CHOOSE COVER PHOTO */}
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
                            <img src={coverPhoto} id="cover-photo" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/**CHOOSE COVER PHOTO END */}

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
                                        <>
                                          {parent.Id ===
                                          this.state.product
                                            .ParentCategoryId ? (
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
                                <>
                                  <div className="input-group mb-3">
                                    <select
                                      onChange={this.subChange}
                                      className="form-control"
                                    >
                                      
                                      {this.state.subList.map((sub, key) => (
                                        <>
                                          {this.state.parentChange === false ? (
                                            sub.Id ===
                                            this.state.product.SubCategoryId ? (
                                              <option
                                                selected
                                                value={sub.Id}
                                                key={key}
                                              >
                                                {sub.Name}
                                              </option>
                                            ) : (
                                              <option value={sub.Id} key={key}>
                                                {sub.Name}
                                              </option>
                                            )
                                          ) : key === 0 ? (
                                            <option
                                              selected
                                              value={sub.Id}
                                              key={key}
                                            >
                                              {sub.Name}
                                            </option>
                                          ) : (
                                            <option value={sub.Id} key={key}>
                                              {sub.Name}
                                            </option>
                                          )}
                                        </>
                                      ))}
                                    </select>
                                    {this.state.errors.subValue && (
                                      <div className="validError">
                                        {this.state.errors.subValue}
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}

                              {this.state.subSubList.length > 0 && (
                                <>
                                  <label htmlFor="mainCategory">
                                    Alt Kategori Seçiniz
                                  </label>
                                  <div className="input-group mb-3">
                                    <select
                                      onChange={this.subSubChange}
                                      className="form-control"
                                    >
                                      <option value="0">
                                        Ana Kategori Seçiniz
                                      </option>
                                      {this.state.subSubList.map((sub, key) => (
                                        <>
                                          {sub.Id ===
                                          this.state.product
                                            .SubSubCategoryId ? (
                                            <option
                                              selected
                                              value={sub.Id}
                                              key={key}
                                            >
                                              {sub.Name}
                                            </option>
                                          ) : (
                                            <option value={sub.Id} key={key}>
                                              {sub.Name}
                                            </option>
                                          )}
                                        </>
                                      ))}
                                    </select>
                                    {this.state.errors.subSubValue && (
                                      <div className="validError">
                                        {this.state.errors.subSubValue}
                                      </div>
                                    )}
                                  </div>
                                </>
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
                                        <>
                                          {this.state.product
                                            .ProductVariationId == v.Id ? (
                                            <option
                                              selected
                                              value={v.Id}
                                              key={key}
                                            >
                                              {v.Name}
                                            </option>
                                          ) : (
                                            <option value={v.Id} key={key}>
                                              {v.Name}
                                            </option>
                                          )}
                                        </>
                                      )
                                    )}
                                  </select>
                                  {this.state.errors.selectedSizes && (
                                    <div className="validError">
                                      {this.state.errors.selectedSizes}
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="card-body">
                                {this.state.childVariations.length > 0 &&
                                  this.state.childVariations.map((v, key) => (
                                    <div className="custom-control custom-checkbox custom-control-inline">
                                      {v.CHECKED === true ? (
                                        <>
                                          <input
                                            onChange={this.handleVariants}
                                            type="checkbox"
                                            value={v.Id}
                                            className="custom-control-input"
                                            id={"customCheck" + key}
                                            defaultChecked
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor={"customCheck" + key}
                                          >
                                            {v.Name}
                                          </label>
                                        </>
                                      ) : (
                                        <>
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
                                        </>
                                      )}
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
                                  onChange={this.handleTextChange}
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
                                  value={this.state.productName}
                                  className="form-control"
                                  onChange={this.handleTextChange}
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
                                  onChange={this.handleTextChange}
                                  className="form-control"
                                  value={this.state.productNormalPrice}
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
                                  onChange={this.handleTextChange}
                                  className="form-control"
                                  value={this.state.productDiscountPrice}
                                  placeholder="Ürün İndirimli Fiyatı"
                                />
                              </div>

                              <label htmlFor="username">Ürün Özellikleri</label>
                              <div className="input-group mb-3">
                                <CKEditor
                                  onChange={this.feauturesChange}
                                  data={this.state.feautures}
                                />
                              </div>

                              <label htmlFor="username">Ürün Açıklaması</label>
                              <div className="input-group mb-3">
                                <CKEditor
                                  onChange={this.descChange}
                                  data={this.state.description}
                                />
                              </div>
                            </div>
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
                                {this.state.newImgList.length > 0 &&
                                  this.state.newImgList.map((file, key) => (
                                    <div className="image-col col-3">
                                      <div className="image-group input-group mb-3">
                                        <a
                                          onClick={() =>
                                            this.destroyImage(
                                              key,
                                              file.type,
                                              file.id,
                                              file.image
                                            )
                                          }
                                          className="remove-image"
                                          href="#0"
                                        >
                                          <i className="fas fa-window-close"></i>
                                        </a>
                                        <img
                                          className="image-parent"
                                          key={key}
                                          src={file.image}
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
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default ProductEdit;
