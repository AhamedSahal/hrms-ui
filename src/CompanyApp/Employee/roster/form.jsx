import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormGroup } from "reactstrap";
import { Helmet } from "react-helmet";
import EmployeeDropdown from "../../ModuleSetup/Dropdown/EmployeeDropdown";
import RosterDropdown from "../../ModuleSetup/Dropdown/RosterDropdown";
import ShiftDropdown from "../../ModuleSetup/Dropdown/ShiftDropdown";
import { getRepeatByRoster, saveRoster } from "./service";
import { getTimeProps } from "antd/lib/date-picker/generatePicker";

export default class RosterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Roster: props.Roster || {
        id: 0,
        applicablefororg: "yes",
        employeeId: props.employeeId,
        employee: { id: props.employeeId },
        description: "",
        rosterId: 0,
        roster: { id: 0 },

      },
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.Roster && nextProps.Roster != prevState.Roster) {
      return { Roster: nextProps.Roster };
    } else if (!nextProps.Roster) {
      return (
        prevState.Roster || {
          Roster: nextProps.Roster || {
            id: 0,
            applicablefororg: "yes",
            employeeId: nextProps.employeeId,
            employee: { id: nextProps.employeeId },
            description: "",
            rosterId: 0,
            roster: { id: 0 },
          },
        }
      );
    }
    return null;
  }
  getListByRoster = (rosterId) => {
    getRepeatByRoster(
      rosterId,
      this.state.q,
      this.state.page,
      this.state.size,
      this.state.sort
    ).then((res) => {
      if (res.status == "OK") {
        const length = res.data.list[0];
        let dummyarray = new Array(parseInt(length)).fill({ label: "", shiftId: "", val: '' });
        for (let i = 0; i < dummyarray.length; i++) {
          let tmpData = {
            label: `Day ${i + 1} `,
            shiftId: `Shift${i + 1}_id`,
            val: null
          }
          dummyarray[i] = tmpData
        }
        this.setState({
          shiftrepeat: res.data.list,
          fieldsArray: dummyarray
        });
      }
    });
  };
  handleClose = (data, index) => {
    let tmpData = this.state.fieldsArray
    tmpData[index] = {
      label: tmpData[index].label,
      shiftId: tmpData[index].shiftId,
      sid: null,
      name: null
    }
    this.setState({
      fieldsArray: tmpData
    })

  }

  onShiftValChange = (val, index) => {
    let tmpData = this.state.fieldsArray
    tmpData[index] = {
      label: tmpData[index].label,
      shiftId: tmpData[index].shiftId,
      sid: val.id,
      name: val.name
    }

    this.setState({
      fieldsArray: tmpData
    })
  }
  _renderShifts = () => {
    let { fieldsArray } = this.state;
    if (fieldsArray && fieldsArray.length !== 0) {
      return fieldsArray.map((val, i) => {
        return <div
          key={i}
          className="rosterAddicon">
          <div
            className=" rosterDays">
            {val.label}
            <br /> <hr></hr> {""}
          </div>
          {val.name ? <a className="rosterEdit" style={{ color: "red", fontSize: "large" }} onClick={(e) => this.handleClose(val, i)}>
            <i class="fa fa-close"></i>
          </a> :
            null
          }
          {/* e */}
          {val.sid ? <div className="rosterPlusIcon">
            {val.name}
          </div> :
            <div className="rosterBtnPlusdiv">
              <button
                className="btn btn-primary"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
                direction="dropend"
              >
                <i className="fa fa-plus"> </i>
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                <Field
                  name="shiftId"
                  render={(field) => {
                    return <ShiftDropdown
                      onChange={(val) => {
                        this.setState({
                          shiftId: val,
                        });
                        this.onShiftValChange(val, i)
                      }}
                    ></ShiftDropdown>;
                  }}
                ></Field>

              </div>
            </div>
          }
        </div>
      })
    }
    return <></>
  }
  save = (data, action) => {
    let tmpData = {};
    tmpData.id = data.id;
    tmpData.rosterId = data.rosterId;
    tmpData.applicablefororg = data.applicablefororg;
    tmpData.employeeId = data.employeeId;
    tmpData.field = this.state.fieldsArray;
    let validation = true;
    if (this.state.fieldsArray.length > 0) {
      this.state.fieldsArray.map((res) => {
        if (res.name == null) {
          validation = false;
        }
      })
    }
    console.log(tmpData)
    if (validation) {
      saveRoster(tmpData).then(res => {
        if (res.status == "OK") {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      }).catch(err => {
        console.log(err);
        toast.error("Error while saving roster");
      })
    } else {
      toast.error("All days should be mapped");
    }
  };
  render() {
    let { fieldsArray, fieldsArrayVal } = this.state;
    let { shiftId } = this.state;
    const { showing } = this.state;
    return (
      <div className="adminInsidePageDiv">
        < div className="page-container content container-fluid" >
          < div className="tablePage-header" >
            <div className="row pageTitle-section">
              <div className="col" >
                <h3 className="tablePage-title">Assign Roster</h3>
              </div>
            </div>
          </div>
          {/* Page Content */}

          <Formik
            enableReinitialize={true}
            initialValues={this.state.Roster}
            onSubmit={this.save} 
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
                <div className="col-md-12">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-4" style={{ fontWeight: "bolder" }}>
                        <FormGroup>
                          <label>
                            Roster
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <Field

                            name="rosterId"
                            render={(field) => {
                              return (
                                <RosterDropdown
                                  onChange={(e) => {
                                    setFieldValue(
                                      "rosterId",
                                      e.target.value
                                    );
                                    setFieldValue("roster", {
                                      id: e.target.value,
                                    });
                                    this.getListByRoster(e.target.value);
                                  }}
                                ></RosterDropdown>
                              );
                            }}
                          ></Field>
                          <ErrorMessage name="rosterId">
                            {(msg) => (
                              <div style={{ color: "red" }}>{msg}</div>
                            )}
                          </ErrorMessage>
                        </FormGroup>
                      </div>

                      {values.applicablefororg == "no" && (

                        <div className="col-md-4" style={{ fontWeight: "bolder" }}>
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
                                    defaultValue={values.employee?.id}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "employeeId",
                                        e.target.value
                                      );
                                      setFieldValue("employee", {
                                        id: e.target.value,
                                      });
                                    }}
                                  ></EmployeeDropdown>
                                );
                              }}
                            ></Field>
                            <ErrorMessage name="employeeId">
                              {(msg) => (
                                <div style={{ color: "red" }}>{msg}</div>
                              )}
                            </ErrorMessage>
                          </FormGroup>
                        </div>

                      )}

                      <div className="col-md-4" style={{ paddingTop: "10px" }}>
                        <FormGroup>
                          <label style={{ fontWeight: "bolder" }}>
                            Applicable to entire organization
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <div
                            className="radio"
                          >
                            <label>
                              <input
                                type="radio"
                                value="yes"
                                name="applicablefororg"
                                onChange={(e) => {
                                  setFieldValue(
                                    "applicablefororg",
                                    e.target.value
                                  );
                                }}
                              />
                              &nbsp;Yes
                            </label>
                            &nbsp;&nbsp;&nbsp;
                            <label>
                              <input
                                type="radio"
                                value="no"
                                name="applicablefororg"
                                onChange={(e) => {
                                  setFieldValue(
                                    "applicablefororg",
                                    e.target.value
                                  );
                                }}
                              />
                              &nbsp;No
                            </label>
                          </div>
                          <ErrorMessage name="applicablefororg">
                            {(msg) => (
                              <div style={{ color: "red" }}>{msg}</div>
                            )}
                          </ErrorMessage>
                        </FormGroup>
                      </div>

                    </div>

                    <div className="row">

                    </div>
                  </div>

                  {this.state.shiftrepeat != "0" && (
                    this.state.fieldsArray ? this.state.fieldsArray.length !== 0 && (
                      <div
                        className="row"
                        style={{
                          paddingLeft: "30px",
                          fontWeight: "bolder"
                        }}
                      >
                        <label>Shifts
                          <span style={{ color: "red" }}>*</span>&nbsp;
                          <span style={{ fontSize: "12px", fontWeight: "normal" }}>(All Days should be mapped.)</span> </label>
                        {this._renderShifts()}
                      </div>) : null)}
                  <div
                    style={{ padding: "15px" }}
                  >
                    <input
                      type="submit"
                      className=" btn btn-primary"
                      value={
                        this.state.Roster.id > 0 ? "Update" : "Publish"
                      }
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}
