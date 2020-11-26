import { extractData } from './extract-data';
import { createHTML } from './testUtils';

describe('extractDataFromElement', () => {
  it('should extract text', () => {
    const html = createHTML(`<div>
      <h2>title</h2>
    </div>`);
    const expected = 'title';
    const actual = extractData(html, 'h2');
    expect(actual).toEqual(expected);
  });
  it('should extract text as object config', () => {
    const html = createHTML(`<div>
      <h2>title</h2>
    </div>`);
    const expected = 'title';
    const actual = extractData(html, { query: 'h2' });
    expect(actual).toEqual(expected);
  });

  it('should extract text when html', () => {
    const html = createHTML(`<div>
      <h2><b>title</b></h2>
    </div>`);
    const expected = 'title';
    const actual = extractData(html, 'h2');
    expect(actual).toEqual(expected);
  });
  it('should extract text when html as object config', () => {
    const html = createHTML(`<div>
      <h2><b>title</b></h2>
    </div>`);
    const expected = 'title';
    const actual = extractData(html, { query: 'h2' });
    expect(actual).toEqual(expected);
  });

  it('should extract html', () => {
    const html = createHTML(`<div>
      <p>description <b>bold</b></p>
    </div>`);
    const expected = 'description <b>bold</b>';
    const actual = extractData(html, 'p', { html: true });
    expect(actual).toEqual(expected);
  });

  it('should extract html as object config', () => {
    const html = createHTML(`<div>
      <p>description <b>bold</b></p>
    </div>`);
    const expected = 'description <b>bold</b>';
    const actual = extractData(html, { query: 'p', html: true });
    expect(actual).toEqual(expected);
  });

  it('should extract attribute', () => {
    const html = createHTML(`<div>
      <img src="foo.jpg" />
    </div>`);
    const expected = 'foo.jpg';
    const actual = extractData(html, 'img', { attr: 'src' });
    expect(actual).toEqual(expected);
  });

  it('should extract a list', () => {
    const html = createHTML(`<div>
      <ul class="tags">
        <li class="tag">a</li>
        <li class="tag">b</li>
        <li class="tag">c</li>
      </ul>
    </div>`);
    const expected = ['a', 'b', 'c'];
    const actual = extractData(html, '.tags > .tag', { list: true });
    expect(actual).toEqual(expected);
  });

  it('should extract a list and fetch attributes', () => {
    const html = createHTML(`<div>
      <ul class="tags">
        <li class="tag" data-id="1">a</li>
        <li class="tag" data-id="2">b</li>
        <li class="tag" data-id="3">c</li>
      </ul>
    </div>`);
    const expected = ['1', '2', '3'];
    const actual = extractData(html, '.tags > .tag', { list: true, attr: 'data-id' });
    expect(actual).toEqual(expected);
  });

  it('should extract a list and fetch attributes and text as object', () => {
    const html = createHTML(`<div>
      <ul class="tags">
        <li class="tag" data-id="1">a</li>
        <li class="tag" data-id="2">b</li>
        <li class="tag" data-id="3">c</li>
      </ul>
    </div>`);
    const expected = [
      { id: '1', text: 'a' },
      { id: '2', text: 'b' },
      { id: '3', text: 'c' },
    ];
    const actual = extractData(html, '.tags > .tag', {
      list: true,
      data: { id: 'data-id', text: true },
    });
    expect(actual).toEqual(expected);
  });

  it('should extract a list and convert the fetched attributes to numbers', () => {
    const html = createHTML(`<div>
      <ul class="tags">
        <li class="tag" data-id="1">a</li>
        <li class="tag" data-id="2">b</li>
        <li class="tag" data-id="3">c</li>
      </ul>
    </div>`);
    const expected = [1, 2, 3];
    const actual = extractData(html, '.tags > .tag', {
      list: true,
      attr: 'data-id',
      convert: 'number',
    });
    expect(actual).toEqual(expected);
  });

  it('should extract a list and fetch attributes and text as object, and convert to number', () => {
    const html = createHTML(`<div>
      <ul class="tags">
        <li class="tag" data-id="1">a</li>
        <li class="tag" data-id="2">b</li>
        <li class="tag" data-id="3">c</li>
      </ul>
    </div>`);
    const expected = [
      { id: 1, text: 'a' },
      { id: 2, text: 'b' },
      { id: 3, text: 'c' },
    ];
    const actual = extractData(html, '.tags > .tag', {
      list: true,
      data: {
        id: { attr: 'data-id', convert: 'number' },
        text: true,
      },
    });
    expect(actual).toEqual(expected);
  });

  it('should throw in missing first parameter', () => {
    const actual = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: intentional
      extractData();
    };
    expect(actual).toThrow("Missing first parameter 'parent'");
  });

  it('should throw in missing second parameter', () => {
    const actual = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: intentional
      extractData(document.createElement('div'));
    };
    expect(actual).toThrow("Missing second parameter 'config'");
  });
});
