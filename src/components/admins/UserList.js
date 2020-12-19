import React, { Component } from "react";
import Header from "../partial/Header";
import SideBar from "../partial/SideBar";
import API from '../../services/api/API';
import firebase from "../../services/firebase/Firebase";
import UserRow from './UserRow';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    }
  }

  componentDidMount = () => {

    let params = {
      data: {},
      url: "admin/user/list/get",
    };

    API.request(params)
      .then((response) => {
        let result = response.data;
        if(result.success){
          this.setState({
            userList: result.data,
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
                    <h4 className="mb-0">Yöneticiler</h4>
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
                    <h4 className="card-title">Admin Listesi</h4>
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
                                Adı
                              </th>
                              <th
                                className="sorting"
                                tabIndex={0}
                                aria-controls="example"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Office: activate to sort column ascending"
                                style={{ width: "116px" }}
                              >
                                Soyadı
                              </th>
                              <th
                                className="sorting"
                                tabIndex={0}
                                aria-controls="example"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Age: activate to sort column ascending"
                                style={{ width: "116px" }}
                              >
                                Kullanıcı Adı
                              </th>
                              <th
                                className="sorting"
                                tabIndex={0}
                                aria-controls="example"
                                rowSpan={1}
                                colSpan={1}
                                aria-label="Start date: activate to sort column ascending"
                                style={{ width: "102px" }}
                              >
                                Yetkisi
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
                                Profil
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
                          {
                            this.state.userList.length > 0 && (
                              this.state.userList.map((user, key) => 
                                  <UserRow key={ key } USER_ID={ user.id } />
                              )
                            )
                          }
                          </tbody>
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

export default UserList;
