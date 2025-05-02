import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormGroup } from "reactstrap";
import TemplateDropdown from "../Dropdown/TemplateDropdown";
import { saveDocumentRequest } from "./service";
import { DocumentRequestSchema } from "./validation";

export default class DocumentRequestForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      documentrequest: props.documentrequest || {
        id: 0,
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.documentrequest && nextProps.documentrequest != prevState.documentrequest) {
      return { documentrequest: nextProps.documentrequest };
    } else if (!nextProps.documentrequest) {
      return {
        documentrequest: {
          id: 0,
        },
      };
    }

    return null;
  }
  save = (data, action) => {
    data.template = { id: data.templateId };
    action.setSubmitting(true);
    saveDocumentRequest(data)
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
        toast.error("Error while saving Document Request");

        action.setSubmitting(false);
      });
  };

  render() {
    let { documentrequest } = this.state;
    documentrequest.templateId = documentrequest.template?.id;
    return (
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={documentrequest}
          onSubmit={this.save}
          validationSchema={DocumentRequestSchema}
        >
          {({
            values,
            setFieldValue,
            /* and other goodies */
          }) => (
            <Form>
              <FormGroup>
                <label>Template</label>
                <TemplateDropdown defaultValue={documentrequest.templateId} onChange={e => {
                  setFieldValue("templateId", e.target.value);
                }}></TemplateDropdown>
                <ErrorMessage name="templateId">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>

              <FormGroup>
                <label>Detail</label>
                <Field name="details" className="form-control" placeholder="Enter Details..." />
                <ErrorMessage name="details">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>

              <input
                type="submit"
                className="btn btn-primary"
                value={this.state.documentrequest.id > 0 ? "Update" : "Save"}
              />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
