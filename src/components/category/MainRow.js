import React, { Component } from "react";
import API from "../../services/api/API";
import { NavLink, Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";

class MainRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: {},
      modalShow: false,
    };
  }

  handleModalClose = () => {
    this.setState({
      modalShow: false,
    });
  };

  showModal = () => {
    this.setState({
      modalShow: true,
    });
  };

  handleDelete = (id) => {
    let params = {
      data: {
        id: id,
      },
      url: "category/main/delete",
    };

    API.request(params)
      .then((response) => {
        let result = response.data;

        if (result.success) {
          this.setState({
            category: {},
            modalShow: false,
          });
          swal("Başarılı!", "Kategori başarıyla silindi!", "success");
        } else {
          swal("Başarısız!", "Kategori işlemi başarısız!", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    let params = {
      data: {
        id: this.props.ID,
      },
      url: "category/main/id",
    };

    API.request(params)
      .then((response) => {
        let result = response.data;
        let category = result.data;

        if (result.success) {
          this.setState({
            category: category,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      Object.keys(this.state.category).length > 0 && (
        <React.Fragment>
          <Modal
            show={this.state.modalShow}
            onHide={() => this.handleModalClose()}
          >
            <Modal.Header closeButton>
              <Modal.Title>Kategori Sil</Modal.Title>
            </Modal.Header>
            <Modal.Body>Silmek istediğinize emin misiniz?</Modal.Body>
            <Modal.Footer>
              <button
                variant="secondary"
                className="btn btn-danger"
                onClick={() => this.handleDelete(this.state.category.Id)}
              >
                Sil
              </button>
              <button
                className="btn btn-primary"
                variant="primary"
                onClick={() => this.handleModalClose()}
              >
                İptal
              </button>
            </Modal.Footer>
          </Modal>
          <tr role="row" className="odd">
            <td className="sorting_1">{this.state.category.Id}</td>
            <td> {this.state.category.Name} </td>
            <td>
              <img
                width="50px"
                height="50px"
                src={this.state.category.Picture}
              />
            </td>
            <td>
              <div className="btn-group mb-2">
                <NavLink to={"/category/main/edit/" + this.state.category.Id}>
                  <button type="button" className="btn btn-primary">
                    Düzenle
                  </button>
                </NavLink>
              </div>
            </td>

            <td>
              <div className="btn-group mb-2">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => this.showModal()}
                >
                  Sil
                </button>
              </div>
            </td>
          </tr>
        </React.Fragment>
      )
    );
  }
}

export default MainRow;
