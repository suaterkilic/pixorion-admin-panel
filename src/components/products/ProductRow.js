import React from "react";
import { Link, NavLink } from "react-router-dom";
import CategoryServices from "../../services/category/CategoryServices";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";

class ProductRow extends React.Component {
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
        id: id,
      },
      url: "product/destroy",
    };

    CategoryServices.sendRequest(params)
      .then((response) => {
        const result = response.data;

        if (result.success) {
          this.setState({
            modalShow: false,
          });
          this.props.getIndex(index);
          swal("Başarılı!", "Ürün başarıyla silindi!", "success");
        } else {
          swal("Başarısız!", "Ürün silinemedi!", "error");
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
            <Modal.Title>Ürün Sil</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bu ürünü silmek istediğinize emin misiniz?</Modal.Body>
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
        <tr role="row" className="odd">
          <td className="sorting_1">{this.props.Id}</td>
          <td>
            <img
              width="40px"
              height="40px"
              src={this.props.ProductCoverPhoto}
            />
          </td>
          <td>{this.props.ProductName}</td>
          <td>{this.props.ProductPrice}</td>
          <td>{this.props.ProductDescription}</td>
          <td>{this.props.CategoryName}</td>
          <td>
            <Link to={'/product/edit/' + this.props.Id}>
              <button className="btn btn-primary">DÜZENLE</button>
            </Link>
          </td>
          <td>
            <button onClick={() => this.showModal()} className="btn btn-danger">
              SİL
            </button>
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

export default ProductRow;
