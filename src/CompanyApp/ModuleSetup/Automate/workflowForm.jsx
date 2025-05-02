import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import * as Yup from 'yup';
import { getDropdownInfo } from './service'




const validationSchema = Yup.object().shape({
    name: Yup.string()
    .min(2, 'Name is Too Short!')
    .max(100, 'Name is Too Long!')
    .required('Please provide workflow name'),
  });


export default class WorkflowFrom extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dropDownData:[],
            Workflow: {
                id: 0,
                name: "",
                active: true,
                code: "",
                formPage: 1
            }
        }
    }
    componentDidMount() { 
        getDropdownInfo().then((res) => {
            if(res.status == "OK" ){
                this.setState({dropDownData:res.data }) 
            }else{
                toast.error(res.message);
            }
        })
    }

   next = (data) => {
    this.props.nextPage(data)
   }
    save = (data, action) => {
        let flag = true;
        const { dropDownData } = this.state;
        dropDownData.map((res) => {
            if(res.name === data.name){
                flag = false;
            }
        })
        if(flag){
        this.props.nextPage(data);
        }else{
            toast.error("Name already exist");
        }
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.Workflow}
                    onSubmit={this.save}
                    validationSchema={validationSchema}
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
                        setSubmitting
                    }) => (
                        <Form autoComplete='off'>

                            <FormGroup>
                                <label>Workflow Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="float-right btn btn-primary" value={'Next'} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
