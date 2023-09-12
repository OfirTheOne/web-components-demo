
import { Show, signal, signalComponent, derivedSignal, FC } from 'sig';
import './form-example.scss';
import { Dropdown, Input } from './controllers'
type FormErrors = {
  firstName?: string;
  lastName?: string;
};
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
const validateForm = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.firstName) {
    errors.firstName = 'First name is required';
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required';
  }

  return errors;
};


const Form: FC = function Form() {
  const formFirstNameValues = signal(initialFormValues.firstName);
  const formLastNameValues = signal(initialFormValues.lastName);
  const formColorValues = signal(initialFormValues.color);
  const formErrors = signal<FormErrors>({});

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const errors = validateForm({
      firstName: formFirstNameValues.value,
      lastName: formLastNameValues.value
    });
    formErrors.setValue(() => errors);
    if (Object.keys(errors).length === 0) {
      alert(
        `${formFirstNameValues.value}, ${formLastNameValues.value}`,
      );
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <Input
          type="text"
          id="firstName"
          value={formFirstNameValues}
          onInput={(e) =>
            formFirstNameValues.setValue(() => (e.target as HTMLInputElement).value)
          }
        />
        <Show
          track={formErrors}
          when={([errors]) => !!(errors.firstName)}
        >
          <label className="error">{derivedSignal(formErrors, (f => f.firstName))}</label>
        </Show>
      </div>

      <div>
        <label htmlFor="lastName">Last Name:</label>
        <Input
          type="text"
          id="lastName"
          value={formLastNameValues}
          onInput={(e) =>
            formLastNameValues.setValue(() => (e.target as HTMLInputElement).value)
          }
        />
        <Show
          track={formErrors}
          when={([errors]) => !!(errors.lastName)}
        >
          <label className="error">{derivedSignal(formErrors, (f => f.lastName))}</label>
        </Show>
      </div>

      <Dropdown
        value={formColorValues}
        options={['red', 'blue']} 
        key="color"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default signalComponent(Form);