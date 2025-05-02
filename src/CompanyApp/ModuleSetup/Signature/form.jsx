import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormGroup } from "reactstrap";
import { saveSignature } from "./service";
import { SignatureSchema } from "./validation";
import { Anchor } from "react-bootstrap";
import { getUserType ,verifyApprovalPermission} from './../../../utility';
import EmployeeDropdown from './../Dropdown/EmployeeDropdown';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class SignatureForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signature: props.signature || {
        id: 0,
        employeeId: props.employeeId,
        signature: "",
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.signature && nextProps.signature != prevState.signature) {
      return { signature: nextProps.signature };
    } else if (!nextProps.signature) {
      return {
        signature: {
          id: 0,
          employeeId: nextProps.employeeId,
        },
      };
    }

    return null;
  }
  save = (data, action) => {
    action.setSubmitting(true);
    saveSignature(data)
      .then((res) => {
        if (res.status == "OK") {
          toast.success(res.message);
          this.props.updateList(res.data);
        } else {
          toast.error(res.message);
        }
        action.setSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error while saving signature");

        action.setSubmitting(false);
      });
  };
  handleChangeImage = (evt) => {
    console.log("Uploading");
    var self = this;
    var reader = new FileReader();
    var file = evt.target.files[0];

    reader.onload = function (upload) {
      console.log({ upload, self });
      self.setState({
        image: upload.target.result,
      });
    };
    reader.readAsDataURL(file);
  };
  render() {
    const { signature, image } = this.state;

    signature.signature = image || signature.signature;
    return (
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={signature}
          onSubmit={this.save}
          validationSchema={SignatureSchema}
        >
          {({
            values,
            setFieldValue,
            /* and other goodies */
          }) => (
            <Form>
              {verifyApprovalPermission("Module Setup Signatures") && (
                <FormGroup>
                  <label>
                    Employee
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    name="employeeId"
                    render={(field) => {
                      return (
                        <EmployeeDropdown
                          defaultValue={values.employeeId}
                          onChange={(e) => {
                            setFieldValue("employeeId", e.target.value);
                            setFieldValue("employee", { id: e.target.value });
                          }}
                        ></EmployeeDropdown>
                      );
                    }}
                  ></Field>
                </FormGroup>
              )}
              <FormGroup>
                <label>
                  Signature
                  <span style={{ color: "red" }}>*</span>&nbsp;
                  <i>Recommended 200x60 resolution.</i>
                </label>
                {values.signature && (
                  <div>
                    <img src={values.signature} width="100" height="100" />
                    <br />
                    <Anchor
                      onclick={(e) => {
                        this.setState({ image: null });
                      }}
                    >
                      Change Image
                    </Anchor>
                  </div>
                )}
                <br />
                <input
                  type="file"
                  name="file"
                  className="upload-file form-control"
                  id="file"
                  onChange={(e) => {
                    this.handleChangeImage(e);
                  }}
                  encType="multipart/form-data"
                  required
                />

                <ErrorMessage name="signature">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>
              <input
                type="submit"
                className="btn btn-primary"
                value={this.state.signature.id > 0 ? "Update" : "Save"}
              />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
