import React from "react";
import Header from "../partial/Header";
import SideBar from "../partial/SideBar";
import CategoryServices from "../../services/category/CategoryServices";
import ProductRow from "./ProductRow";

class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parentList: [],
      subList: [],
      subSubList: [],
      parentValue: "",
      subValue: "",
      subSubValue: "",
      productList: [],
    };
  }

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
              subSubList: [],
              productList: [],
              subSubValue: "",
            });
          } else {
            this.setState({
              subList: [],
              subValue: "",
              subSubList: [],
              subSubValue: "",
              productList: [],
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
        parentValue: "",
        subValue: "",
        subSubValue: "",
        productList: [],
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
              productList: [],
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
        productList: [],
      });
    }
  };

  subSubChange = (e) => {
    const selected = parseInt(e.target.value);

    if (selected !== 0) {
      const params = {
        data: {
          id: selected,
        },
        url: "product/list/sub",
      };

      CategoryServices.sendRequest(params)
        .then((response) => {
          const result = response.data;

          if (result.success) {
            const data = result.data;

            if (data.length > 0) {
              this.setState({
                productList: data,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  getIndexData = (key) => {
    let temp = [];

    temp = this.state.productList.concat();

    temp.splice(key, 1);

    this.setState({
      productList: temp,
    });
  };

  componentDidMount = () => {
    this.parentCategories();
  };

  render() {
    return (
      <React.Fragment>
        <Header USER_INFO={this.props.USER_INFO} />
        <SideBar USER_INFO={this.props.USER_INFO} />
        <main>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-lg-8 mt-3">
                <div className="card category-form">
                  <div className="card-header">
                    <h4 className="card-title">Ürün Düzenle</h4>
                  </div>

                  <div className="card-content">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <form>
                            <div>
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
                                </div>
                              )}
                            </div>
                            {/**IMAGES */}
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <div className="card">
                  <div className="card-header  justify-content-between align-items-center">
                    <h4 className="card-title">Ürünler</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <div
                        id="example_wrapper"
                        className="dataTables_wrapper dt-bootstrap4"
                      >
                        {this.state.productList.length > 0 && (
                          <table
                            id="example"
                            className="display table dataTable table-striped table-bordered"
                            role="grid"
                            aria-describedby="example_info"
                          >
                            <thead>
                              <tr role="row">
                                <th
                                  className="sorting_asc"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-sort="ascending"
                                  aria-label="Name: activate to sort column descending"
                                  style={{ width: "52px" }}
                                >
                                  #
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Position: activate to sort column ascending"
                                  style={{ width: "40px" }}
                                >
                                  Resim
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Office: activate to sort column ascending"
                                  style={{ width: "117px" }}
                                >
                                  Ürün İsmi
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Age: activate to sort column ascending"
                                  style={{ width: "20px" }}
                                >
                                  Ürün Fiyatı
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Start date: activate to sort column ascending"
                                  style={{ width: "103px" }}
                                >
                                  Ürün Açıklaması
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Start date: activate to sort column ascending"
                                  style={{ width: "103px" }}
                                >
                                  Ürün Kategorisi
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Start date: activate to sort column ascending"
                                  style={{ width: "103px" }}
                                >
                                  Düzenle
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Start date: activate to sort column ascending"
                                  style={{ width: "103px" }}
                                >
                                  Sil
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.productList.map((product, key) => (
                                <ProductRow
                                  Index={key}
                                  Id={product.Id}
                                  ProductName={product.ProductName}
                                  ProductDescription={
                                    product.ProductDescription
                                  }
                                  ProductPrice={product.ProductNormalPrice}
                                  ProductCoverPhoto={product.ProductCoverPhoto}
                                  CategoryName={product.Name}
                                  getIndex={this.getIndexData}
                                />
                              ))}
                            </tbody>
                          </table>
                        )}
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

export default ProductList;
