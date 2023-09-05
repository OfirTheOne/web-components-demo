
import { Show, signal, signalComponent, derivedSignal, FC } from 'sig';
import './form-example.scss';

type FormErrors = {
  firstName?: string;
  lastName?: string;
};
type FormValues = {
  firstName: string;
  lastName: string;
};

const initialFormValues: FormValues = {
  firstName: 'firstName',
  lastName: 'lastName',
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
        <input
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
        <input
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default signalComponent(Form);