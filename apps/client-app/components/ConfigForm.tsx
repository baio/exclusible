import { ISpreadConfig } from '@exclusible/shared';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { SpreadConfig } from '../features/config/configModels';
import { ApiResult, Result } from '../features/shared';

export interface ConfigFormProps {
  config: SpreadConfig;
  onSet: (evt: SpreadConfig) => Promise<ApiResult<ISpreadConfig>>;
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
          const result = await onSet(values);
          setSubmitting(false);
          if (result.kind === 'ok') {
            console.log('success');
          } else {
            // TODO : Error handling here
            console.error(result.error);
          }
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
