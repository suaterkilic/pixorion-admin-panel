import React from "react";
import Header from "../../partial/Header";
import SideBar from "../../partial/SideBar";
import API from "../../../services/api/API";
import SubColumn from "./SubColumn";
import SubRows from "./SubRows";
import SubSubColumn from "./SubSubColumn";
import SubSubRows from "./SubSubRows";
class SubList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainList: [],
      subList: [],
      subSubList: [],
      subState: false,
      subSubState: false,
      parentValue: "",
    };
  }

  fetchMainData = () => {
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

  parentCategoryChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    if (selectedValue !== 0) {
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
            const data = result.data;

            this.setState({
              subList: data,
              subState: true,
              subSubState: false,
              parentValue: selectedValue
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        subState: false,
        subSubState: false,
        subList: [],
      });
    }
  };

  subCategoryChange = (e) => {
    const selectedValue = parseInt(e.target.value);

    if (selectedValue !== 0) {
      const params = {
        data: {
          value: selectedValue,
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
              subSubState: true,
              subState: false,
            });
          }else{
            this.setState({
              subSubState: false,
              subSubList: []
            })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        subSubState: false,
        subState: true
      });
    }
  };

  componentDidMount = () => {
    this.fetchMainData();
  };

  deleteSubState = (key) => {
    let tempSub = [];
    tempSub = this.state.subList.concat();

    tempSub.splice(key, 1);

    this.setState({
      subList: tempSub
    });
  }

  deleteSubSubState = (key) => {
    let tempSub = [];
    tempSub = this.state.subSubList.concat();

    tempSub.splice(key, 1);

    this.setState({
      subSubList: tempSub
    });
  }

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
                            <div className="input-group mb-3">
                              <select
                                onChange={(e) => this.parentCategoryChange(e)}
                                className="form-control"
                              >
                                <option value="0">Ana Kategori Seçiniz</option>

                                {this.state.mainList.length > 0 &&
                                  this.state.mainList.map((main, key) => (
                                    <option key={key} value={main.Id}>
                                      {main.Name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            {this.state.subList.length > 0 && (
                              <div className="input-group mb-3">
                                <select
                                  onChange={(e) => this.subCategoryChange(e)}
                                  className="form-control"
                                >
                                {
                                  this.state.selectedValue !== "" ? (
                                    <option selected value="0">
                                      Alt Kategori Seçiniz
                                    </option>
                                  ):(
                                    <option value="0">
                                      Alt Kategori Seçiniz
                                    </option>
                                  )
                                }
                                  {this.state.subList.map((sub, key) => (
                                    <option value={sub.Id} key={key}>
                                      {sub.Name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
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
            <div className="row">
              <div className="col-12 mt-3">
                <div className="card">
                  <div className="card-header  justify-content-between align-items-center">
                    <h4 className="card-title">Alt Kategoriler</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <div
                        id="example_wrapper"
                        className="dataTables_wrapper dt-bootstrap4"
                      >
                        <table
                          id="example"
                          className="display table dataTable table-striped table-bordered"
                          role="grid"
                          aria-describedby="example_info"
                        >
                          {this.state.subState === true && (
                            <>
                              <thead>
                                <SubColumn />
                              </thead>
                              <tbody>
                                {this.state.subList.length > 0 &&
                                  this.state.subList.map((sub, key) => (
                                    <SubRows
                                      getData={this.deleteSubState.bind(this)}
                                      key={key}
                                      Index={key}
                                      Id={sub.Id}
                                      Name={sub.Name}
                                      Type={sub.Type}
                                      ParentName={sub.PARENT_NAME}
                                      Display={sub.Display}
                                    />
                                  ))}
                              </tbody>
                            </>
                          )}
                          {this.state.subSubState === true && (
                            <>
                              <thead>
                                <SubSubColumn />
                              </thead>
                              <tbody>
                                {this.state.subSubList.length > 0 &&
                                  this.state.subSubList.map((sub, key) => (
                                    <SubSubRows
                                      getData={this.deleteSubSubState.bind(this)}
                                      key={key}
                                      Index={key}
                                      Id={sub.Id}
                                      Name={sub.Name}
                                      Type={sub.Type}
                                      Display={sub.Display}
                                      ParentName={sub.PARENT_NAME}
                                      SubName={sub.SUB_NAME}
                                    />
                                  ))}
                              </tbody>
                            </>
                          )}
                        </table>
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

export default SubList;
