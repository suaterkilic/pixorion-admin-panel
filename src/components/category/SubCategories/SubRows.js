import React from "react";
import { Link, NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";
import API from "../../../services/api/API";

class SubRows extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalShow: false,
      isLoading: false,
    };
  }

  closeModal = () => {
    this.setState({
      modalShow: false,
    });
  };

  showModal = () => {
    this.setState({
      modalShow: true,
    });
  };

  handleDelete = (id, index) => {
    this.setState({ isLoading: true });
    const params = {
      data: {
        value: id,
      },
      url: "category/sub/destroy",
    };

    API.request(params)
      .then((response) => {
        const result = response.data;

        if (result.success) {
          this.props.getData(index);
          this.setState({
            isLoading: false,
          });
          swal("Başarılı!", "Alt Kategori Silindi!", "success");
        } else {
          swal("Başarısız!", "Alt Kategori Silinemedi!", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <Modal show={this.state.modalShow} onHide={() => this.closeModal()}>
          <Modal.Header closeButton>
            <Modal.Title>Alt Kategori Sil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bu kategoriyi silmek istediğinize emin misiniz ?
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => this.handleDelete(this.props.Id, this.props.Index)}
              className="btn btn-danger"
              variant="primary"
            >
              Sil
            </button>
            <button
              variant="secondary"
              className="btn btn-primary"
              onClick={() => this.closeModal()}
            >
              İptal
            </button>
          </Modal.Footer>
        </Modal>
        <tr
          key={this.props.key}
          role="row"
          className={this.props.key % 2 == 0 ? "odd" : "even"}
        >
          <td>{this.props.Id}</td>
          <td className="sorting_1">{this.props.Name}</td>
          <td>{this.props.Type == "sub" ? "2.Seviye Alt Kategori" : ""}</td>
          <td>{this.props.Display == 1 ? "Aktif" : "Pasif"}</td>
          <td>{this.props.ParentName}</td>
          <td>
            <div className="form-group">
              <Link to={"/category/sub/edit/" + this.props.Id}>
                <button type="button" className="btn btn-primary">
                  DÜZENLE
                </button>
              </Link>
            </div>
          </td>
          <td>
            <div className="form-group">
              <button
                onClick={() => this.showModal()}
                type="button"
                className="btn btn-danger"
              >
                SİL
              </button>
            </div>
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

export default SubRows;
