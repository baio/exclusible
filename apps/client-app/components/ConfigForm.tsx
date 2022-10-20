import { ISpreadConfig } from '@exclusible/shared';
import { Field, Form, Formik } from 'formik';
import { SpreadConfig } from '../features/config/configModels';
import { ApiResult } from '../features/shared';

export interface ConfigFormProps {
  config: SpreadConfig;
  onSet: (evt: SpreadConfig) => Promise<ApiResult<ISpreadConfig>>;
}

const ConfigForm = ({ onSet, config }: ConfigFormProps) => {
  return (
    <div>
      <h2 className="subtitle">Spread config</h2>
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
          <div className="field">
            <label className="label">Buy offset</label>
            <div className="control">
              <Field
                className="input"
                type="number"
                name="buyOffset"
                placeholder="Buy offset"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Sell offset</label>
            <div className="control">
              <Field
                className="input"
                type="number"
                name="sellOffset"
                placeholder="Sell offset"
              />
            </div>
          </div>
          <button type="submit" className="button is-warning">
            Save
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default ConfigForm;
