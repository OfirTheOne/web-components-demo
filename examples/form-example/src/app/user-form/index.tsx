
import { signal, signalComponent, derivedSignal, Switch, Case } from '@sigjs/sig';
import { CheckboxController, TextInputController } from '@sigjs/forms';
import './index.scss';

const setTimeoutAsync = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))

type FormValues = {
  firstName: string;
  lastName: string;
  noValidate: boolean;
};

const initialFormValues: FormValues = {
  firstName: 'firstName',
  lastName: 'lastName',
  noValidate: false
};

type SubmissionState = 'un-submitted' | 'pending' | 'submitted';

export default signalComponent(function Form() {
    const formFirstNameValues = signal(initialFormValues.firstName);
  const formLastNameValues = signal(initialFormValues.lastName);
  const formNoValidate = signal(initialFormValues.noValidate);
  const formSubmissionState = signal<SubmissionState>('un-submitted');
  const formRef: { current: HTMLFormElement | null } = { current: null };

  const handleSubmit = (e: JSX.SigEvent) => {
    e.preventDefault();
    if(formRef.current && formRef.current.checkValidity()) {
      formSubmissionState.setValue(() => 'pending');
      setTimeoutAsync(1000 * 2).then(() => formSubmissionState.setValue(() => 'submitted'));
    } else {
      alert("Form is not valid");
    }
  };

  return (
    <form 
      ref={formRef}
      noValidate={derivedSignal(formNoValidate, (value) => value === false ? null : value) as unknown as boolean}
      onSubmit={handleSubmit}>

      <TextInputController 
        value={formFirstNameValues}
        label="First Name"
        id="firstName"
        required
        validation={(value) => !!value}
        validationError="First name is required"
      />
      <TextInputController  
        value={formLastNameValues}
        label="Last Name"
        id='Last Name'
        required
        validation={(value) => !!value}
        validationError="Last name is required"
       />
      <CheckboxController 
        value={formNoValidate}
        label="No Validate"
        id="no-validate"
      />
      <button class:list={[
        { 'no-validate': formNoValidate }
      ]} type="submit">
        Submit
      </button>

      <p>
        <Switch 
          track={[formSubmissionState]}
          fallback={<span> Form Not Submitted </span>}>
          <Case when={([submissionState]) => submissionState === 'pending'}>
            <span> 🔄 Pending </span>
          </Case>
          <Case when={([submissionState]) => submissionState === 'submitted'}>
            <span> ✅ Submitted </span>
          </Case>
        </Switch>
      </p>

      <p>
        <button type="button" onClick={() => {
          formFirstNameValues.setValue(() => initialFormValues.firstName);
          formLastNameValues.setValue(() => initialFormValues.lastName);
          formNoValidate.setValue(() => initialFormValues.noValidate);
          formSubmissionState.setValue(() => 'un-submitted');
        }}> Reset </button>
      </p>
    </form>
  );
});

