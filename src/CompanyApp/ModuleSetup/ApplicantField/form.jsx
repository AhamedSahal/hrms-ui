import React, { Component } from "react";
import { ApplicantSchema } from "./Validation";
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { saveApplicantData } from "./service";
import { toast } from "react-toastify";
import { getApplicantInfo} from "../../Hire/Job/service";

export default class ApplicantForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicantField: [],
      Applicant: props.applicant || {
        id: 0,
        name: "",
        required: true,
        active: true,
      },
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
     // applicant field
     getApplicantInfo().then((res) => {
      if (res.status == "OK") {
        this.setState({ applicantField: res.data });
      }
    });

  }

  save = (data, action) => {
    let validation = true
    let check = this.state.applicantField.length > 0 && this.state.applicantField.map((res) => {
      if (res.fieldName.toLowerCase() == data.fieldName.toLowerCase()) {
        validation = false;
      }
    })
    if (validation) {
      saveApplicantData(data)
        .then((res) => {
          if (res.status == "OK") {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
          if (res.status == "OK") {
            this.props.updateData();
          }
        })
        .catch((err) => {
          toast.error("Error while Adding Applicant");
        });
    }else{
      toast.error("Name Already exist");
    }
  };

  render() {
    return (
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={this.state.Applicant}
          onSubmit={this.save}
          validationSchema={ApplicantSchema}
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
                <label>
                  Name
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Field name="fieldName" className="form-control"></Field>
                <ErrorMessage name="fieldName">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>

              <FormGroup>
                <div
                  type="checkbox"
                  name="required"
                  onClick={(e) => {
                    let { Applicant } = this.state;
                    Applicant.required = !Applicant.required;
                    setFieldValue("required", Applicant.required);
                    this.setState({
                      Applicant,
                    });
                  }}
                >
                  <label>Required</label>
                  <br />
                  <i
                    className={`fa fa-2x ${
                      this.state.Applicant && this.state.Applicant.required
                        ? "fa-toggle-on text-success"
                        : "fa fa-toggle-off text-danger"
                    }`}
                  ></i>
                </div>
              </FormGroup>
              <input
                type="submit"
                className="btn btn-primary"
                value={this.state.Applicant.id > 0 ? "Update" : "Save"}
              />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
