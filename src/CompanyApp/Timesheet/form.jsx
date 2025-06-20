import React, { useState, useEffect } from 'react';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { saveTimesheet } from './service';
import { TimesheetSchema } from './validation';
import { getEmployeeId } from '../../utility';
import TimesheetRow from './timesheetRow';
import Bowser from 'bowser';

const browser = Bowser.getParser(window.navigator.userAgent);
const browserName = browser.getBrowserName();
const isSafari = browserName === 'Safari';
const CreateTimesheetForm = ({ timesheet: initialTimesheet, self, employeeId, showAlert, updateList }) => {
    const [timesheets, setTimesheets] = useState([]);
    const [count, setCount] = useState(0);

    const addRecord = React.useCallback(() => {
        setTimesheets(prevTimesheets => [
            ...prevTimesheets,
            {
                id: 0,
                employeeId: employeeId || getEmployeeId(),
                date: "",
                hours: 0,
                project: "",
                activity: "",
                description: ""
            }
        ]);
        setCount(prevCount => prevCount + 1);
    }, [employeeId]);

    useEffect(() => {
        if (!initialTimesheet || initialTimesheet.id === 0) {
            addRecord();
        } else {
            setTimesheets([initialTimesheet]);
        }
    }, [initialTimesheet, addRecord]);

    const updateState = (updatedTimesheet, index) => {
        setTimesheets(prevTimesheets => {
            const newTimesheets = [...prevTimesheets];
            newTimesheets[index] = updatedTimesheet;
            return newTimesheets;
        });
    };

    const save = (data, action) => {
        data.forEach((a, i) => {
            a.date = new Date(`${a.date} GMT`).toISOString().substring(0, 10);
            action.setSubmitting(true);
            saveTimesheet(a).then(res => {
                if (res.status === "OK") {
                    if (i === data.length - 1) {
                        showAlert('submit');
                    }
                    updateList(res.data);
                } else {
                    toast.error(res.message);
                }
                if (i === data.length - 1) {
                    action.setSubmitting(false);
                }
            }).catch(() => {
                toast.error("Error while submitting timesheet.");
                action.setSubmitting(false);
            });
        });
    };

    const removeRow = (index) => {
        setTimesheets(prevTimesheets => {
            const newTimesheets = [...prevTimesheets];
            newTimesheets.splice(index, 1);
            return newTimesheets;
        });
        setCount(prevCount => prevCount - 1);
    };

    return (
        <div>
            <Formik
                enableReinitialize={true}
                initialValues={timesheets}
                onSubmit={save}
                validationSchema={TimesheetSchema}
            >
                {() => (
                    <Form>
                        {timesheets && timesheets.length > 0 && timesheets.map((timesheet, index) => (
                            <TimesheetRow
                                key={`${index}-${count}`}
                                self={self}
                                timesheet={timesheet}
                                index={index}
                                updateState={updateState}
                                removeRow={removeRow}
                            />
                        ))}

                        <div className="row">
                            <div className="col-md-3">
                                <input
                                    type="submit"
                                    className="btn btn-primary"
                                    value={initialTimesheet && initialTimesheet.id > 0 ? "Update" : "Submit"}
                                />
                            </div>
                            {(!initialTimesheet || initialTimesheet.id === 0) && count < 7 && (
                                <div className="col-md-9 text-right">
                                    <i
                                        className="text-success fa fa-plus fa-2x pointer"
                                        onClickCapture={addRecord}
                                    ></i>
                                </div>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateTimesheetForm;
