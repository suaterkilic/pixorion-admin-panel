import React from "react";

class SubColumn extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <tr role="row">
          <th
            className="sorting_asc"
            tabIndex={0}
            aria-controls="example"
            rowSpan={1}
            colSpan={1}
            aria-sort="ascending"
            aria-label="Name: activate to sort column descending"
            style={{ width: "52px" }}
          >
            #
          </th>
          <th
            className="sorting_asc"
            tabIndex={0}
            aria-controls="example"
            rowSpan={1}
            colSpan={1}
            aria-sort="ascending"
            aria-label="Name: activate to sort column descending"
            style={{ width: "154px" }}
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
            style={{ width: "249px" }}
          >
            Tipi
          </th>
          <th
            className="sorting"
            tabIndex={0}
            aria-controls="example"
            rowSpan={1}
            colSpan={1}
            aria-label="Office: activate to sort column ascending"
            style={{ width: "117px" }}
          >
            Durumu
          </th>
          <th
            className="sorting"
            tabIndex={0}
            aria-controls="example"
            rowSpan={1}
            colSpan={1}
            aria-label="Age: activate to sort column ascending"
            style={{ width: "52px" }}
          >
            Ana Kategorisi
          </th>

          <th
            className="sorting"
            tabIndex={0}
            aria-controls="example"
            rowSpan={1}
            colSpan={1}
            aria-label="Age: activate to sort column ascending"
            style={{ width: "52px" }}
          >
            DÜZENLE
          </th>
          <th
            className="sorting"
            tabIndex={0}
            aria-controls="example"
            rowSpan={1}
            colSpan={1}
            aria-label="Age: activate to sort column ascending"
            style={{ width: "52px" }}
          >
            SİL
          </th>
          
        </tr>
      </React.Fragment>
    );
  }
}

export default SubColumn;
