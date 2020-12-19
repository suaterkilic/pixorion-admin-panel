import React from "react";
import Modal from "react-bootstrap/Modal";
import { Link, NavLink } from "react-router-dom";
import swal from "sweetalert";
import API from "../../../services/api/API";

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
    };
  }

  modalShow = () => {
    this.setState({
      modalShow: true,
    });
  };

  handleDelete = (id, key) => {
    const params = {
      data: {
        id: id,
      },
      url: "visual/slider/destroy",
    };

    API.request(params)
      .then((res) => {
        const result = res.data;

        if (result.success) {
          swal("Başarılı", "Slider silindi!", "success");
          this.props.getDelete(key);
          this.setState({
            modalShow: false,
          });
        } else {
          swal("Başarısız", "Slider silinemedi!", "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const data = this.props;
    return (
      <React.Fragment>
        <Modal
          show={this.state.modalShow}
          onHide={() => this.handleModalClose()}
        >
          <Modal.Header closeButton>
            <Modal.Title>Slider Sil</Modal.Title>
          </Modal.Header>
          <Modal.Body>Silmek istediğinize emin misiniz?</Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => this.handleDelete(this.props.Id, this.props.Index)}
              variant="secondary"
              className="btn btn-danger"
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
          <td className="sorting_1">{data.Id}</td>
          <td>{data.TitleFirst}</td>
          <td>{data.Content}</td>
          <td>
            <img width="50px" heigth="50px" src={data.Image} />
          </td>
          <td>
            <Link to={"/visual/slider/edit/" + this.props.Id}>
            <button className="btn btn-primary">DÜZENLE</button>
            </Link>
          </td>
          <td>
              <button onClick={this.modalShow} className="btn btn-danger">
                SİL
              </button>
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

export default Row;
