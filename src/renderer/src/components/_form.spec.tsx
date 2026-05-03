import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';

import { Form } from './_form.component';
import { resolveInitialData, resolveNextValue, resolveSubmitResult, validateControls } from './_form.hook';

describe('Form component', () => {
  it('renders controls and default action buttons', () => {
    const html = renderToStaticMarkup(
      <Form
        onSubmit={() => {}}
        controls={[
          { id: 'name', label: 'Name' },
          { id: 'amount', label: 'Amount', type: 'number', placehoder: '0.00' },
        ]}
      />,
    );

    assert.match(html, /for="name"/);
    assert.match(html, /for="amount"/);
    assert.match(html, /type="number"/);
    assert.match(html, /placeholder="0\.00"/);
    assert.match(html, />common\.clean</);
    assert.match(html, />common\.submit</);
  });

  it('renders cancel button only when enabled', () => {
    const html = renderToStaticMarkup(<Form onSubmit={() => {}} enableCancel onCancel={() => {}} />);
    assert.match(html, />common\.cancel</);
  });

  it('uses provided data over control default value', () => {
    const html = renderToStaticMarkup(
      <Form
        onSubmit={() => {}}
        data={{ code: 'from-data' }}
        controls={[{ id: 'code', label: 'Code', value: 'from-control' }]}
      />,
    );

    assert.match(html, /value="from-data"/);
  });
});

describe('Form hook helpers', () => {
  it('resolveInitialData merges controls with data and ignores undefined', () => {
    const data = resolveInitialData(
      [
        { id: 'a', label: 'A', value: 'default-a' },
        { id: 'b', label: 'B' },
      ],
      { a: 'data-a' },
    );

    assert.deepEqual(data, { a: 'data-a' });
  });

  it('validateControls returns first error per field', () => {
    const errors = validateControls(
      [
        {
          id: 'name',
          label: 'Name',
          validations: [
            { rule: 'REQUIRED', message: 'Required' },
            { rule: 'CUSTOM', message: 'Min 3', customValidation: (value) => String(value).length >= 3 },
          ],
        },
      ],
      { name: '' },
    );

    assert.deepEqual(errors, { name: 'Required' });
  });

  it('validateControls returns empty object when all fields are valid', () => {
    const errors = validateControls(
      [
        {
          id: 'name',
          label: 'Name',
          validations: [{ rule: 'REQUIRED', message: 'Required' }],
        },
      ],
      { name: 'ok' },
    );

    assert.deepEqual(errors, {});
  });

  it('resolveNextValue applies parseTo when present', () => {
    const nextValue = resolveNextValue(
      { id: 'amount', label: 'Amount', parseTo: (value) => Number(value.replace(/[^\d]/g, '')) },
      '12x',
    );
    assert.equal(nextValue, 12);
  });

  it('resolveNextValue keeps raw value when parseTo is missing', () => {
    const nextValue = resolveNextValue({ id: 'plain', label: 'Plain' }, 'abc');
    assert.equal(nextValue, 'abc');
  });

  it('resolveSubmitResult blocks submit when there are validation errors', () => {
    const result = resolveSubmitResult(
      [{ id: 'name', label: 'Name', validations: [{ rule: 'REQUIRED', message: 'Required' }] }],
      { name: '' },
    );

    assert.equal(result.canSubmit, false);
    assert.deepEqual(result.errors, { name: 'Required' });
  });

  it('resolveSubmitResult allows submit when all validations pass', () => {
    const result = resolveSubmitResult(
      [{ id: 'name', label: 'Name', validations: [{ rule: 'REQUIRED', message: 'Required' }] }],
      { name: 'Ana' },
    );

    assert.equal(result.canSubmit, true);
    assert.deepEqual(result.errors, {});
  });
});
