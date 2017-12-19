import { extractFromHTML } from '../../src/lib/extract-from-html';
import { createHTML } from '../helpers';

const expect = require('chai').expect;

describe('extractFromHTML', () => {
  it('should extract an object', () => {
    const html = createHTML(`
      <div class="items">
        <div class="grid-item">
          <h2>title</h2>
          <p>description <b>bold</b></p>
          <img class="js-image" src="foo.jpg" alt="foobar" />
          <ul class="tags">
            <li class="tag">a</li>
            <li class="tag">b</li>
            <li class="tag">c</li>
          </ul>
          <a href="http://www.google.com" target="_blank">google</a>
        </div>
        <div class="grid-item">
          <h2>title</h2>
          <p>description <b>bold</b></p>
          <img class="js-image" src="foo.jpg" alt="foobar" />
          <ul class="tags">
            <li class="tag">a</li>
            <li class="tag">b</li>
            <li class="tag">c</li>
          </ul>
          <a href="http://www.google.com" target="_blank">google</a>
        </div>
      </div>
    `);

    const expected = {
      title: 'title',
      description: 'description <b>bold</b>',
      tags: ['a', 'b', 'c'],
      image: {
        src: 'foo.jpg',
        alt: 'foobar',
      },
      image2: {
        src: "foo.jpg",
        alt: "foobar",
      },
      link: {
        href: 'http://www.google.com',
        text: 'google',
        target: '_blank',
      },
    };

    const actual = extractFromHTML(
      html,
      {
        query: '.grid-item',
        data: {
          title: 'h2',
          description: { query: 'p', html: true },
          tags: { query: '.tags > .tag', list: true },
          image: (extract) => ({
            src: extract('.js-image', { attr: 'src' }),
            alt: extract('.js-image', { attr: 'alt' }),
          }),
          image2: (extract) =>
            extract('.js-image', {
              data: { src: 'src', alt: 'alt' }
            }),
          link: {
            query: 'a',
            data: {
              href: 'href',
              target: 'target',
              text: true,
            },
          },
        },
      },
    );

    expect(actual).to.deep.equal(expected);
  });

  it('should extract an array', () => {
    const html = createHTML(`
      <div class="items">
        <div class="grid-item">
          <h2>title</h2>
          <p>description <b>bold</b></p>
          <img class="js-image" src="foo.jpg" alt="foobar" />
          <ul class="tags">
            <li class="tag">a</li>
            <li class="tag">b</li>
            <li class="tag">c</li>
          </ul>
          <a href="http://www.google.com" target="_blank">google</a>
        </div>
        <div class="grid-item">
          <h2>title</h2>
          <p>description <b>bold</b></p>
          <img class="js-image" src="foo.jpg" alt="foobar" />
          <ul class="tags">
            <li class="tag">a</li>
            <li class="tag">b</li>
            <li class="tag">c</li>
          </ul>
          <a href="http://www.google.com" target="_blank">google</a>
        </div>
      </div>
    `);

    const expected = [
      {
        title: 'title',
        description: 'description <b>bold</b>',
        tags: ['a', 'b', 'c'],
        image: {
          src: 'foo.jpg',
          alt: 'foobar',
        },
      },
      {
        title: 'title',
        description: 'description <b>bold</b>',
        tags: ['a', 'b', 'c'],
        image: {
          src: 'foo.jpg',
          alt: 'foobar',
        },
      },
    ];
    const actual = extractFromHTML(
      html,
      {
        query: '.grid-item',
        list: true,
        data: {
          title: 'h2',
          description: { query: 'p', html: true },
          tags: { query: '.tags > .tag', list: true },
          image: (extract) => ({
            src: extract('.js-image', { attr: 'src' }),
            alt: extract('.js-image', { attr: 'alt' }),
          }),
        },
      },
    );

    expect(actual).to.deep.equal(expected);
  });


  it('should merge in initial data', () => {
    const html = createHTML(`
      <div class="items">
        <div class="grid-item">
          <h2>title</h2>
          <p>description <b>bold</b></p>
          <ul class="tags">
            <li class="tag">a</li>
            <li class="tag">b</li>
            <li class="tag">c</li>
          </ul>
          <a href="http://www.google.com" target="_blank">google</a>
        </div>
      </div>
    `);

    const expected = {
      title: 'title',
      description: 'description <b>bold</b>',
      tags: ['default', 'a', 'b', 'c'],
      link: {
        href: 'http://www.google.com',
        text: 'google',
        target: '_blank',
        tested: false,
      },
      visible: true,
    };

    const actual = extractFromHTML(
      html,
      {
        query: '.grid-item',
        data: {
          title: 'h2',
          description: { query: 'p', html: true },
          tags: { query: '.tags > .tag', list: true },
          link: {
            query: 'a',
            data: {
              href: 'href',
              target: 'target',
              text: true,
            },
          },
        },
      },
      {
        visible: true,
        tags: ['default'],
        link: {
          tested: false,
        }
      },
    );

    expect(actual).to.deep.equal(expected);
  });

  it('should extract from own element', () => {
    const html = createHTML(`
      <div class="items">
        <div class="grid-item" data-id="1">
          <h2>title 1</h2>
        </div>
        <div class="grid-item" data-id="2">
          <h2>title 2</h2>
        </div>
        <div class="grid-item" data-id="3">
          <h2>title 3</h2>
        </div>
      </div>
    `);

    const expected = [
      {
        id: 1,
        title: 'title 1',
      },
      {
        id: 2,
        title: 'title 2',
      },
      {
        id: 3,
        title: 'title 3',
      },
    ];

    const actual = extractFromHTML(
      html,
      {
        list: true,
        query: '.grid-item',
        data: {
          title: 'h2',
        },
        self: {
          id: { attr: 'data-id', convert: 'number'}
        },
      },
    );

    expect(actual).to.deep.equal(expected);
  });

  it('should extract from own element when passed directly', () => {
    const html = createHTML(`
      <div class="grid-item" data-id="1">
        <h2>title 1</h2>
      </div>
    `);

    const expected = {
      id: 1,
      title: 'title 1',
    };

    const actual = extractFromHTML(
      html,
      {
        data: {
          title: 'h2',
        },
        self: {
          id: { attr: 'data-id', convert: 'number'}
        },
      },
    );

    expect(actual).to.deep.equal(expected);
  });

  it('should throw in missing first parameter', () => {
    const actual = () => {
      // @ts-ignore: intentional
      extractFromHTML();
    };
    expect(actual).to.throw('Missing first parameter \'container\'');
  });

  it('should throw in missing second parameter', () => {
    const actual = () => {
      // @ts-ignore: intentional
      extractFromHTML(document.createElement('div'));
    };
    expect(actual).to.throw('Missing second parameter \'config\'');
  });
});
