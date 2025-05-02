import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal, Anchor } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { fileDownload } from '../../../HttpRequest';
import { getPermission, getReadableDate, getUserType, verifyEditPermission } from '../../../utility';
import DocumentDetailEmployeeForm from './documentDetailForm';
import { getDocumentInformation } from './service';

const { Header, Body, Footer, Dialog } = Modal;

export default class DocumentDetailList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.employeeId || 0,
      data: [],
      document: [],
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    getDocumentInformation(this.state.id).then(res => {
      if (res.status == "OK") {
        this.setState({
          data: res.data,
        })
      }
    })
  }

  updateList = (document) => {
    this.fetchList();
    let { data } = this.state;
    let index = data.findIndex(d => d.id == document.id);
    if (index > -1)
      data[index] = document;
    else {
      data = [document, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      employee: undefined
    })
  }

  render() {
    const { data } = this.state;

    console.log('cell : --', data)
    
    const isEditAllowed =true;// verifyEditPermission("EMPLOYEE");
     return (
      <>
        <div className="row">
          <div className="col-md-12 ">
            <div className="expireDocs-table">
              <table className="table">
                <thead >
                  <tr style={{ background: '#c4c4c4' }}>
                    <th>#</th>
                    <th>Document No</th>
                    <th>Document Type</th>
                    <th>Document Status</th>
                    <th>File Name</th>
                    <th>Issued Date</th>
                    <th>Expiry On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={`${item.empId}_${index}`} className="table-row">
                      <td className="table-column">{index + 1}</td>
                      <td className="table-column">{item.documentNo}</td>
                      <td className="table-column">{item.documentType}</td>
                      <td className="table-column">{item.documentStatus}</td>
                      <td className="table-column">
                        <Anchor onClick={() => {
                          fileDownload(item.downloadId, item.employeeId, "EMPLOYEE_DOCUMENT", item.fileName);
                        }} title={item.fileName}>
                          <i className='fa fa-download'></i> Download
                        </Anchor>
                      </td>
                      <td className="table-column">{getReadableDate(item.issuedOn)}</td>
                      <td className="table-column">{getReadableDate(item.expireOn)}</td>
                      <td className="table-column">
                        <div className="dropdow">
                          <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <i className="las la-bars"></i>
                          </a>
                          {(item.edit || verifyEditPermission("COMPANY_ADMIN") ) && <div className="dropdown-menu dropdown-menu-right">
                            {<a className="dropdown-item" href="#" onClick={() => {

                              try {
                                item.issuedOn = item.issuedOn.substr(0, 10);
                                item.expireOn = item.expireOn.substr(0, 10);
                              } catch (error) {
                                console.error(error)
                              }
                              this.setState({ document: item, showForm: true })
                            }} >
                              <i className="fa fa-pencil m-r-5"></i> Edit</a>}

                          </div>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">Edit Document</h5>
          </Header>
          <Body>
            <DocumentDetailEmployeeForm updateList={this.updateList} document={this.state.document}>
            </DocumentDetailEmployeeForm>
          </Body>
        </Modal>
      </>
    );
  }
}
