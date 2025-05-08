import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormGroup } from "reactstrap";
import { TEMPLATE_TYPE } from "../../../Constant/enum";
import HtmlEditor from "../../../HtmlEditor";
import EnumDropdown from './../Dropdown/EnumDropdown';
import { saveTemplate } from "./service";
import { TemplateSchema } from "./validation";
export default class TemplateForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      template: props.template || {
        id: 0,
        employeeId: props.employeeId,
        template: "",
        templateType: props.templateType || "DOCUMENT",
        name:'',
        displayName:'',
        subject:'',
        footer:'',
        body:'',
        header:''
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.template && nextProps.template != prevState.template) {
      return { template: nextProps.template };
    } else if (!nextProps.template) {
      return {
        template: {
          id: 0,
          employeeId: nextProps.employeeId,
          templateType: "DOCUMENT",
        },
      };
    }

    return null;
  }
  save = (data, action) => {
    if(data.header == '<p><br></p>'){
      toast.error("Header should not be Empty");
      action.setSubmitting(false);
    }
    else if(data.body == '<p><br></p>')
    {
      toast.error("Body should not be Empty");
      action.setSubmitting(false);
    }
    else if(data.footer == '<p><br></p>'){
      toast.error("Footer should not be Empty");
      action.setSubmitting(false);
    }
    else{
    action.setSubmitting(true);
    saveTemplate(data)
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
        toast.error("Error while saving template");
        action.setSubmitting(false);
      });
    }
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
    const { template, image } = this.state;
    return (
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={template}
          onSubmit={this.save}
          validationSchema={TemplateSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setSubmitting,
            /* and other goodies */
          }) => (
            <Form autoComplete="off">
              <FormGroup>
                <label>Template Type
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Field name="templateType" className="form-control"
                  render={field => {
                    return <EnumDropdown  label={"Template Type"} enumObj={TEMPLATE_TYPE} defaultValue={template.templateType} onChange={e => {
                      setFieldValue("templateType", e.target.value)
                    }}>
                    </EnumDropdown>
                  }}
                ></Field>
              </FormGroup>
              <FormGroup>
                <label>Name <span style={{ color: "red" }}>*</span></label>
                <Field name="name" className="form-control" placeholder="Enter Template Name..." required/>
                <ErrorMessage name="name">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup>
                <label>Display Name  <span style={{ color: "red" }}>*</span></label>
                <Field name="displayName" className="form-control" placeholder="Enter Display Name..." required/>
                <ErrorMessage name="displayName">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup hidden={template?.templateType == "DOCUMENT"}>
                <label>Subject</label>
                <Field name="subject" className="form-control" placeholder="Enter Subject..." />
              </FormGroup>

              <FormGroup>
                <label>Header  <span style={{ color: "red" }}>*</span></label>
                <HtmlEditor name="header" defaultValue={template.header} onChange={val => {
                  setFieldValue("header", val)
                }}>
                </HtmlEditor>
                <ErrorMessage name="header">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>

              <FormGroup>
                <label>Body  <span style={{ color: "red" }}>*</span></label>
                <HtmlEditor name="body" defaultValue={template.body} onChange={val => {
                  setFieldValue("body", val)
                }}>
                </HtmlEditor>
                <ErrorMessage name="body">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>

              <FormGroup>
                <label>Footer  <span style={{ color: "red" }}>*</span></label>
                <HtmlEditor name="footer" defaultValue={template.footer} onChange={val => {
                  setFieldValue("footer", val)
                }}></HtmlEditor>
                <ErrorMessage name="footer">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>

              <input
                type="submit"
                className="btn btn-primary"
                value={this.state.template.id > 0 ? "Update" : "Save"}
              />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
