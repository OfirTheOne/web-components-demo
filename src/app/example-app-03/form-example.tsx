import { FC } from '@lib/index';
import { signal, signalComponent } from '@lib/core/signal-core';

type FormValues = {
  firstName: string;
  lastName: string;
};

const initialFormValues: FormValues = {
  firstName: 'firstName',
  lastName: 'lastName',
};

const Form: FC = function Form() {
  const formFirstNameValues = signal(initialFormValues.firstName);
  const formLastNameValues = signal(initialFormValues.lastName);

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    alert(
      `${formFirstNameValues.value}, ${formLastNameValues.value}`,
    );
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
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default signalComponent(Form);