import React from "react";
import { Link, NavLink } from "react-router-dom";
import API from "../../../services/api/API";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";

class SubSubRows extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalShow: false,
    };
  }

  showModal = () => {
    this.setState({
      modalShow: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalShow: false,
    });
  };

  handleDestory = (id, index) => {
    const params = {
      data: {
        value: id,
      },
      url: "category/sub/sub/destroy",
    };

    API.request(params)
      .then((response) => {
        const result = response.data;

        if (result.success) {
          this.props.getData(index);

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
            Bu kategoriyi silmeden önce kategoriye ait ürünleri başka bir
            kategoriye taşımanız gerek. Silmek istediğinize emin misiniz?
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-danger"
              variant="primary"
              onClick={() =>
                this.handleDestory(this.props.Id, this.props.Index)
              }
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
          <td>{this.props.Type == "subsub" ? "3.Seviye Alt Kategori" : ""}</td>
          <td>{this.props.Display == 1 ? "Aktif" : "Pasif"}</td>
          <td>{this.props.ParentName}</td>
          <td>{this.props.SubName}</td>
          <td>
            <div className="form-group">
              <Link to={"/category/sub/sub/edit/" + this.props.Id}>
                <button type="button" className="btn btn-danger">
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
                className="btn btn-primary"
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
export default SubSubRows;
