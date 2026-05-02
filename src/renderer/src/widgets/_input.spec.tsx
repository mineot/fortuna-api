import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';

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

  it('does not render required bullet when required is false/undefined', () => {
    const html = renderToStaticMarkup(<Input id="city" label="City" />);

    assert.doesNotMatch(html, /&#8226;/);
  });

  it('renders required bullet and required attribute when required is true', () => {
    const html = renderToStaticMarkup(<Input id="doc" label="Document" required />);

    assert.match(html, /<span[^>]*>•<\/span>/);
    assert.match(html, /<input[^>]*required=""/);
  });

  it('does not render message block when message is missing', () => {
    const html = renderToStaticMarkup(<Input id="zip" label="ZIP" />);

    assert.doesNotMatch(html, /form-text/);
  });

  it('renders danger message style by default when message exists', () => {
    const html = renderToStaticMarkup(<Input id="pwd" label="Password" message="Invalid value" />);

    assert.match(html, /form-text text-danger/);
    assert.match(html, />Invalid value</);
  });

  it('renders warning message style when messageType is warning', () => {
    const html = renderToStaticMarkup(
      <Input id="amount" label="Amount" message="Check this value" messageType="warning" />,
    );

    assert.match(html, /form-text text-warning/);
    assert.match(html, />Check this value</);
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
