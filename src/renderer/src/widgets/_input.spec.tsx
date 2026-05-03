import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { ChangeEvent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { useInput } from './_input.hooks';
import { Input } from './_input.widget';

describe('Input widget', () => {
  it('renders label and id binding', () => {
    const html = renderToStaticMarkup(<Input id="username" label="Username" />);

    assert.match(html, /<label[^>]*for="username"[^>]*>Username<\/label>/);
    assert.match(html, /<input[^>]*id="username"/);
  });

  it('uses default type text when type is not provided', () => {
    const html = renderToStaticMarkup(<Input id="name" label="Name" />);

    assert.match(html, /<input[^>]*type="text"/);
  });

  it('uses custom type when provided', () => {
    const html = renderToStaticMarkup(<Input id="amount" label="Amount" type="number" />);

    assert.match(html, /<input[^>]*type="number"/);
  });

  it('renders placeholder when provided', () => {
    const html = renderToStaticMarkup(<Input id="email" label="Email" placehoder="name@email.com" />);

    assert.match(html, /placeholder="name@email\.com"/);
  });

  it('does not render required bullet when REQUIRED validation is missing', () => {
    const html = renderToStaticMarkup(<Input id="city" label="City" />);

    assert.doesNotMatch(html, /&#8226;/);
  });

  it('renders required bullet and required attribute when REQUIRED validation exists', () => {
    const html = renderToStaticMarkup(
      <Input id="doc" label="Document" validations={[{ rule: 'REQUIRED', message: 'Required' }]} />,
    );

    assert.match(html, /<span[^>]*>•<\/span>/);
    assert.match(html, /<input[^>]*required=""/);
  });

  it('does not render message block when there are no failing validations', () => {
    const html = renderToStaticMarkup(<Input id="zip" label="ZIP" />);

    assert.doesNotMatch(html, /form-text/);
  });

  it('renders validation message when first rule fails', () => {
    const html = renderToStaticMarkup(
      <Input
        id="pwd"
        label="Password"
        value=""
        validations={[{ rule: 'REQUIRED', message: 'Required field' }]}
      />,
    );

    assert.match(html, /form-text text-warning/);
    assert.match(html, />Required field</);
  });

  it('renders string value directly', () => {
    const html = renderToStaticMarkup(<Input id="s1" label="S1" value="abc" />);

    assert.match(html, /value="abc"/);
  });

  it('converts number value to string', () => {
    const html = renderToStaticMarkup(<Input id="n1" label="N1" value={42} />);

    assert.match(html, /value="42"/);
  });

  it('converts Date value to ISO string', () => {
    const date = new Date('2026-01-10T12:34:56.000Z');
    const html = renderToStaticMarkup(<Input id="d1" label="D1" value={date} />);

    assert.match(html, /value="2026-01-10T12:34:56\.000Z"/);
  });

  it('uses empty string when value is undefined', () => {
    const html = renderToStaticMarkup(<Input id="empty" label="Empty" />);

    assert.match(html, /value=""/);
  });

  it('applies parseFrom when provided', () => {
    const html = renderToStaticMarkup(
      <Input id="currency" label="Currency" value={1234} parseFrom={(value) => `R$ ${String(value)}`} />,
    );

    assert.match(html, /value="R\$ 1234"/);
  });
});

describe('useInput hook', () => {
  it('uses parseFrom for input value when provided', () => {
    const model = useInput({ id: 'currency', label: 'Currency', value: 10, parseFrom: (value) => `R$ ${value}` });
    assert.equal(model.inputValue, 'R$ 10');
  });

  it('uses empty string when value is undefined', () => {
    const model = useInput({ id: 'empty', label: 'Empty' });
    assert.equal(model.inputValue, '');
  });

  it('returns first failing validation message', () => {
    const model = useInput({
      id: 'name',
      label: 'Name',
      value: '',
      validations: [
        { rule: 'REQUIRED', message: 'Required' },
        { rule: 'CUSTOM', message: 'Too short', customValidation: (value) => String(value).length >= 3 },
      ],
    });

    assert.equal(model.validationMessage, 'Required');
  });

  it('treats blank spaces as invalid for REQUIRED rule', () => {
    const model = useInput({
      id: 'name',
      label: 'Name',
      value: '   ',
      validations: [{ rule: 'REQUIRED', message: 'Required' }],
    });

    assert.equal(model.validationMessage, 'Required');
  });

  it('ignores CUSTOM validation when customValidation is missing', () => {
    const model = useInput({
      id: 'name',
      label: 'Name',
      value: 'ok',
      validations: [{ rule: 'CUSTOM', message: 'Custom error' }],
    });

    assert.equal(model.validationMessage, undefined);
  });

  it('applies parseTo and parseFrom in handleChange before onChange', () => {
    let receivedValue = '';
    const model = useInput({
      id: 'amount',
      label: 'Amount',
      parseTo: (value) => Number(value.replace(/[^\d]/g, '')),
      parseFrom: (value) => `R$ ${value}`,
      onChange: (event) => {
        receivedValue = event.target.value;
      },
    });

    const event = {
      target: { value: '12x' },
      currentTarget: { value: '12x' },
    } as unknown as ChangeEvent<HTMLInputElement>;

    model.handleChange(event);

    assert.equal(event.target.value, 'R$ 12');
    assert.equal(event.currentTarget.value, 'R$ 12');
    assert.equal(receivedValue, 'R$ 12');
  });

  it('keeps original event value when parseTo is absent', () => {
    let receivedValue = '';
    const model = useInput({
      id: 'plain',
      label: 'Plain',
      onChange: (event) => {
        receivedValue = event.target.value;
      },
    });
    const event = {
      target: { value: 'abc' },
      currentTarget: { value: 'abc' },
    } as unknown as ChangeEvent<HTMLInputElement>;

    model.handleChange(event);
    assert.equal(receivedValue, 'abc');
  });
});
