import { extractFromElement } from '../../src/lib/extract-from-element';
import { createHTML } from '../helpers';

const expect = require('chai').expect;

describe('extractFromElement', () => {
  it('should extract text', () => {
    const html = createHTML(`<h2>title</h2>`);
    const expected = 'title';
    const actual = extractFromElement(html, {});
    expect(actual).to.equal(expected);
  });
  it('should extract text when html', () => {
    const html = createHTML(`<h2><b>title</b></h2>`);
    const expected = 'title';
    const actual = extractFromElement(html, {});
    expect(actual).to.equal(expected);
  });

  it('should extract html', () => {
    const html = createHTML(`<p>description <b>bold</b></p>`);
    const expected = 'description <b>bold</b>';
    const actual = extractFromElement(html, { html: true });
    expect(actual).to.equal(expected);
  });

  it('should extract attribute', () => {
    const html = createHTML(`<img src="foo.jpg" />`);
    const expected = 'foo.jpg';
    const actual = extractFromElement(html, { attr: 'src' });
    expect(actual).to.equal(expected);
  });


  it('should extract multiple properties from the same element', () => {
    const html = createHTML(`<a href="http://www.google.com" target="_blank">google</a>`);
    const expected = {
      href: 'http://www.google.com',
      target: '_blank',
      text: 'google',
    };
    const actual = extractFromElement(html, {
      data: {
        href: 'href',
        target: 'target',
        text: true,
      },
    });
    expect(actual).to.deep.equal(expected);
  });


  it('should convert the extracted value with user func', () => {
    const html = createHTML(`<li>123</li>`);
    const expected = 123;
    const actual = extractFromElement(html, { convert: v => parseInt(v, 10) });
    expect(actual).to.equal(expected);
  });
  it('should convert the extracted value to number', () => {
    const html = createHTML(`<li>123</li>`);
    const expected = 123;
    const actual = extractFromElement(html, { convert: 'number' });
    expect(actual).to.equal(expected);
  });
  it('should convert the extracted value to float', () => {
    const html = createHTML(`<li>123</li>`);
    const expected = 123;
    const actual = extractFromElement(html, { convert: 'float' });
    expect(actual).to.equal(expected);
  });
  it('should convert the extracted value to boolean', () => {
    const html = createHTML(`<li>true</li>`);
    const expected = true;
    const actual = extractFromElement(html, { convert: 'boolean' });
    expect(actual).to.equal(expected);
  });
  it('should convert the extracted value to date', () => {
    const html = createHTML(`<li>2017-02-04</li>`);
    const expected = new Date(Date.UTC(2017, 1, 4)).getTime();
    const actual = extractFromElement(html, { convert: 'date' }).getTime();
    expect(actual).to.equal(expected);
  });

  it('should return null when no element match', () => {
    const expected = null;
    const actual = extractFromElement(null, {});
    expect(actual).to.equal(expected);
  });
});
