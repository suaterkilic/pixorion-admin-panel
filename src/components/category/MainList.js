import React from "react";
import MainRow from "./MainRow";
import Header from "../partial/Header";
import SideBar from "../partial/SideBar";
import API from "../../services/api/API";

class MainList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryList: [],
    };
  }

  componentDidMount = () => {
    let params = {
      data: {},
      url: "category/main/list",
    };

    API.request(params)
      .then((response) => {
        let result = response.data;
        let categories = result.data;
        if (result.success && categories.length > 0) {
          this.setState({
            categoryList: categories,
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
                    <h4 className="mb-0">Ana Kategoriler</h4>
                  </div>
                </div>
              </div>
            </div>
            {/* END: Breadcrumbs*/}
            {/* START: Card Data*/}
            <div className="row">
              <div className="col-12 mt-3">
                <div className="card">
                  <div className="card-header  justify-content-between align-items-center">
                    <h4 className="card-title">Ana Kategori Listesi</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <div
                        id="example_wrapper"
                        className="dataTables_wrapper dt-bootstrap4"
                      >
                        {this.state.categoryList.length > 0 ? (
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
                                  style={{ width: "50px" }}
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
                                  style={{ width: "251px" }}
                                >
                                  Kategori Adı
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Position: activate to sort column ascending"
                                  style={{ width: "251px" }}
                                >
                                  Resmi
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Salary: activate to sort column ascending"
                                  style={{ width: "92px" }}
                                >
                                  Düzenle
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Salary: activate to sort column ascending"
                                  style={{ width: "92px" }}
                                >
                                  Sil
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {this.state.categoryList.map((category, key) => (
                                <MainRow key={key} ID={category.Id} />
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div>Hiç Kategori Bulunmuyor</div>
                        )}
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

export default MainList;
