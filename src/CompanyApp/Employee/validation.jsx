import * as Yup from 'yup';

export const NewEmployeeSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .matches(/^[a-zA-Z._ ]+$/, 'First name should not contain numbers/special characters')
        .required('Please provide Name'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .matches(/^[a-zA-Z._ ]+$/, 'Last name should not contain numbers/special characters')
        .required('Please provide Name'),
    email: Yup.string()
        .email('Invalid email')
        .required('Please provide email'),
    doj: Yup.string()
        .required('Please provide date of joining'),
        branchId:Yup.string()
        .required('Please select Location')


});

export const EmployeeSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .matches(/^[a-zA-Z._ ]+$/, 'First name should not contain numbers/special characters')
        .required('Please provide Name'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .matches(/^[a-zA-Z._ ]+$/, 'Last name should not contain numbers/special characters')
        .required('Please provide Name'),
    email: Yup.string()
        .email('Invalid email')
        .required('Please provide email'),
   
    phone: Yup.string()
    .matches(/^\+?[0-9]+$/, 'Please enter a valid phone number') // Only digits, optional starting "+"
    .test('phone-length', 'Phone number must be 7 to 15 digits', value => {
        if (!value) return false;
        const numericValue = value.replace(/\D/g, ''); // Remove all non-digit characters
        return numericValue.length >= 7 && numericValue.length <= 15;
    }),

    dob: Yup.date()
        .nullable()
        .max(new Date(),'Please provide a valid date'),
        // .required('Please provide date of birth')
    // gender: Yup.string()
    //     .required("Please select gender"),
    // bloodGroup: Yup.string()
    //     .required("Please select Blood Group"),
    // maritalStatus: Yup.string()
    //     .required("Please select Marital Status"),

    // religionId: Yup.number()
    //     .min(1, "Please select Religion"),
    // languages: Yup.array().min(1, 'Select at least one language'),
    // totalExperience: Yup.string()
    //     .required("Please provide Total Experience"),

    middleName: Yup.string()
        .matches(/^[a-zA-Z._ ]+$/,'Middle name should not contain numbers/special characters' ),
    
    fatherName: Yup.string()
        .nullable()
        .matches(/^[a-zA-Z._ ]+$/,'Father name should not contain numbers/special characters' ),
    totalExperience: Yup.string()
         .matches(/^[0-9\b]+(\.[0-9]{0,2})?$/,'please valid experience')
});

export const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .required("Please enter password")
})

export const UpdateUsernameSchema = Yup.object().shape({
    newUserName: Yup.string()
        .email("Please enter valid Email")
        .required("Please enter Username")
})

export const attendanceByAdminSchema = Yup.object().shape({
    employeeId: Yup.string()
        .required('Please Select employee'),
    date: Yup.string()
        .required('Please Select Date'),
    inTiming: Yup.string()
        .required('Please Select In Time')
        .test('is-inTiming-date-matching', 'In Timing date should match with Date', function (value, { parent }) {
            const inTimingDate = value?.substring(0, 10);
            const dateDate = parent?.date;
            if (inTimingDate === dateDate) {
                return true;
            }
            else {
                return false;
            }
        }),
    outTiming: Yup.string()
        .required('Please Select Out Time')
        .test('is-outTiming-greater', 'Out Time must be greater than In Time', function (value, { parent }) {
            const inTiming = parent.inTiming;
            const outTiming = value;
            if (!inTiming) {
                return false;
            }
            if (inTiming && outTiming) {
                return outTiming > inTiming;
            }
            return true;
        }),
});

export const BankDetailsSchema = Yup.object().shape({
    accountHolderName: Yup.string()
        .max(20, 'Too Long!')
        .matches(/^[a-zA-Z._ ]+$/,'Account Holder Name should be alphabets' )
        .required('Please Enter Account Holder Name'),
        accountNumber: Yup.string()
        .max(30, "Too Long!")
        .required("Please Enter Account Number")
        .matches(/^(?!\s*$)[0-9@._ ]+$/, "Please Enter a valid Account Number"), 
    bankName: Yup.string()
        .matches(/^[a-zA-Z@._ ]+$/,'Bank Name should not contain numbers' )
        .required('Please Enter Bank Name'),
    ibanNumber: Yup.string()
        .required('Please Enter IBAN Number'),
    branchLocation: Yup.string()
        .matches(/^[a-zA-Z@._ ]+$/,'Please enter valid Branch Location')
        .required('Please Enter Branch-Location '),
    labourCardNo: Yup.string() 
        .matches(/^[0-9@._ ]+$/,'Labour card number should contain only numbers')    
});

export const SalaryBasicAndModeSchema = Yup.object().shape({
    basicSalary: Yup.number()
        .typeError('Basic salary must be a number')
        .min(1, 'Basic salary must be greater than or equal to 1')
        .required('Please enter Basic Salary'),
    salaryCalculationMode: Yup.string()
        .required('Please select Salary Calculation Mode').nullable('Please select Salary Calculation Mode'),
        currency: Yup.number().required('Please select currency')

});

export const AddressDetailEmployeeSchema = Yup.object().shape({
    buildingName: Yup.string()
    .max(20, 'Too Long!')
    .matches(/^[a-zA-Z@._ ]+$/,'Building Name should not contain numbers').nullable('Building Name should not contain numbers'),
    city: Yup.string()
    .matches(/^[a-zA-Z@._ ]+$/,'City should not contain numbers').nullable('City should not contain numbers'),
    zipCode: Yup.string()
    .matches(/^[0-9+() -]*$/,'Zip code should contain only numbers').nullable('Zip code should contain only numbers'),
    contactperson: Yup.string()
    .matches(/^[a-zA-Z@._ ]+$/,'Contact Person should not contain numbers').nullable('Contact Person should not contain numbers'),
    relationship:Yup.string()
    .matches(/^[a-zA-Z@._ ]+$/,'Relationship should not contain numbers').nullable('Relationship should not contain numbers'),
    personalPhone: Yup.string()
    .matches(/^[0-9+() -]*$/,'Phone number should contain only numbers').nullable('Phone number should contain only numbers'),
    mobile: Yup.string()
    .matches(/^[0-9+() -]*$/,'Mobile number should contain only numbers').nullable('Mobile number should contain only numbers')
})