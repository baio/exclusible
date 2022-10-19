import { ErrorMessage, Field, Form, Formik } from 'formik';
import { SpreadConfig } from '../features/config/configModels';

export interface ConfigFormProps {
  config: SpreadConfig;
  onSet: (evt: SpreadConfig) => Promise<void>;
}

const ConfigForm = ({ onSet, config }: ConfigFormProps) => {
  return (
    <div>
      <h2>Spread config</h2>
      <Formik
        enableReinitialize={true}
        initialValues={config}
        onSubmit={async (
          values,
          { setSubmitting, setFieldValue, setFieldError, setFieldTouched }
        ) => {
          await onSet(values);
          setSubmitting(false);
        }}
      >
        <Form>
          <label>Buy offset:</label>
          <Field type="number" name="buyOffset" placeholder="Buy offset" />
          <label>Sell offset:</label>
          <Field type="number" name="sellOffset" placeholder="Sell offset" />
          <button type="submit">Save</button>
        </Form>
      </Formik>
    </div>
  );
};

export default ConfigForm;
