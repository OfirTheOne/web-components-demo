
import { signal, signalComponent, FC } from 'sig';
import './form-example.scss';
import { Checkbox, Dropdown, Input, InputController } from './controllers'


type FormValues = {
  firstName: string;
  lastName: string;
  color?: string;
};

const initialFormValues: FormValues = {
  firstName: 'firstName',
  lastName: 'lastName',
  color: 'red'

};



const Form: FC = function Form() {
  const formFirstNameValues = signal(initialFormValues.firstName);
  const formLastNameValues = signal(initialFormValues.lastName);
  const formColorValues = signal(initialFormValues.color);
  const formNoValidate = signal(false);

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    // alert("Form submitted");
  };

  return (
    <form 
      // noValidate={formNoValidate as unknown as boolean}
      onSubmit={handleSubmit}>

      <InputController 
        value={formFirstNameValues}
        label="First Name"
        id="firstName"
        required
        validation={(value) => !!value}
        validationError="First name is required"
      />
      <InputController  
        value={formLastNameValues}
        label="Last Name"
        id='Last Name'
        required
        validation={(value) => !!value}
        validationError="Last name is required"
       />
      {/* <Dropdown
        value={formColorValues}
        options={['red', 'blue']} 
        key="color"
      /> */}
      <Checkbox 
        value={formNoValidate}
        label="No Validate"
        id="no-validate"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default signalComponent(Form);