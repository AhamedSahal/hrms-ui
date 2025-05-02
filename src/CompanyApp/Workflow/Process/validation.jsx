import * as Yup from 'yup';


export const WorkflowProcessSchema = Yup.object().shape({

    workflowStepName: Yup.string()
        .required('Please provide Workflow Step Name'),
    workFlowId: Yup.number()
        .min(1, 'Please provide Workflow Name'),

});