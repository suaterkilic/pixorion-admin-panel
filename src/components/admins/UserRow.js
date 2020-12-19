import React, { Component } from "react";
import API from '../../services/api/API';
import { NavLink, Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";

class UserRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {},
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
      url: "admin/user/delete",
    };

    API.request(params)
      .then((response) => {
        let result = response.data;

        if (result.success) {
          this.setState({
            userData: {},
            modalShow: false
          });
          swal("Başarılı!", "Admin başarıyla silindi!", "success");
        }else{
          swal("Başarısız!", "Silme işlemi başarısız!", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    let params = {
      data: {
        id: this.props.USER_ID,
      },
      url: "admin/user/id",
    };

    API.request(params).then((response) => {
      let result = response.data;

      if (result.success) {
        this.setState({
          userData: result.data,
        });
      }
    });
  };

  render() {
    return (
      Object.keys(this.state.userData).length > 0 && (
        <React.Fragment>
          <Modal
            show={this.state.modalShow}
            onHide={() => this.handleModalClose()}
          >
            <Modal.Header closeButton>
              <Modal.Title>Admin Sil</Modal.Title>
            </Modal.Header>
            <Modal.Body>Silmek istediğinize emin misiniz?</Modal.Body>
            <Modal.Footer>
              <button
                variant="secondary"
                className="btn btn-danger"
                onClick={() => this.handleDelete(this.state.userData.Id)}
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
            <td className="sorting_1">{this.state.userData.Id}</td>
            <td> {this.state.userData.Name} </td>
            <td>{this.state.userData.Surname}</td>
            <td>{this.state.userData.Username}</td>
            <td>{this.state.userData.Authority}</td>
            <td>
              <img
                width="50px"
                height="50px"
                src={this.state.userData.ProfilePicture}
              />
            </td>
            <td>
              <div className="btn-group mb-2">
              <NavLink to={ '/admin/user/edit/' + this.state.userData.Id }>
                <button type="button" className="btn btn-primary">
                  Düzenle
                </button>
                </NavLink>
              </div>
            </td>

            <td>
              <div className="btn-group mb-2">
              {
                this.state.userData.Authority !== 'manager' ? (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => this.showModal()}
                  >
                    Sil
                  </button>
                ):(
                  <span>Ana Yönetici Hesabı Silinemez</span>
                )
              }
              </div>
            </td>
          </tr>
        </React.Fragment>
      )
    );
  }
}

export default UserRow;
