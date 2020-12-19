import React from "react";
import Header from "../../partial/Header";
import SideBar from "../../partial/SideBar";
import Row from "./Row";
import API from "../../../services/api/API";

class SliderList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        sliderList: []
    }
  }

  fetchSlider = () => {
    const params = {
      data: {},
      url: "visual/slider/all",
    };

    API.request(params)
      .then((res) => {
        const result = res.data;

        if(result.success){
            this.setState({
                sliderList: result.data
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount = () => {
      this.fetchSlider();
  }

  removeIndexDelete = (key) => {
    let temp = [];

    temp = this.state.sliderList.concat();

    temp.splice(key, 1)

    this.setState({
      sliderList: temp
    })
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
                    <h4 className="mb-0">Görsel Yönetimi</h4>
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
                    <h4 className="card-title">Slider Listesi</h4>
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
                                Başlık
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
                                Content
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
                                Resim
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
                              this.state.sliderList.length > 0 && (
                                this.state.sliderList.map((s, key) => 
                                    <Row 
                                        Index={key}
                                        Id={s.Id}
                                        TitleFirst={s.TitleFirst}
                                        TitleSecond={s.TitleSecond}
                                        Content={s.Content}
                                        ButtonText={s.ButtonText}
                                        Image={s.Image}
                                        getDelete={this.removeIndexDelete}
                                    />
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

export default SliderList;
