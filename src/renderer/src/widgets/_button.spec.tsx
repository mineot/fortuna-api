import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';

import { Button } from './_button.widget';

describe('Button widget', () => {
  it('renders label', () => {
    const html = renderToStaticMarkup(<Button label="Save" />);

    assert.match(html, />Save</);
  });

  it('uses default type button when type is not provided', () => {
    const html = renderToStaticMarkup(<Button label="Action" />);

    assert.match(html, /<button[^>]*type="button"/);
  });

  it('uses provided type when defined', () => {
    const html = renderToStaticMarkup(<Button label="Submit" type="submit" />);

    assert.match(html, /<button[^>]*type="submit"/);
  });

  it('uses primary variant by default', () => {
    const html = renderToStaticMarkup(<Button label="Default" />);

    assert.match(html, /class="[^"]*btn-primary[^"]*"/);
  });

  it('uses provided variant class', () => {
    const html = renderToStaticMarkup(<Button label="Cancel" variant="secondary" />);

    assert.match(html, /class="[^"]*btn-secondary[^"]*"/);
  });

  it('renders icon when provided', () => {
    const html = renderToStaticMarkup(<Button label="Edit" icon="pencil" />);

    assert.match(html, /<i[^>]*class="bi bi-pencil"/);
  });

  it('does not render icon when not provided', () => {
    const html = renderToStaticMarkup(<Button label="No Icon" />);

    assert.doesNotMatch(html, /<i[^>]*class="bi bi-/);
  });

  it('renders disabled attribute when disabled is true', () => {
    const html = renderToStaticMarkup(<Button label="Disabled" disabled />);

    assert.match(html, /<button[^>]*disabled=""/);
  });
});
