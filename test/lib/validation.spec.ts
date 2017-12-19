import { extractFromHTML } from '../../src/lib/extract-from-html';
import { createHTML } from '../helpers';

const expect = require('chai').expect;

function getHTML() {
  return createHTML(`
    <div class="items">
      <div class="grid-item">
      </div>
    </div>
  `);
}

describe('validation', () => {
  it('should throw on unknown property', () => {
    const actual = () => extractFromHTML(
      getHTML(),
      {
        query: 'sdf',
        data: {
          title: 'h2',
        },
        foobar: true,
      },
    );
    expect(actual).to.throw('"foobar" is not allowed');
  });

  it('should throw on missing query when paired with list', () => {
    const actual = () => extractFromHTML(
      getHTML(),
      {
        list: true,
        data: {
          title: 'h2',
        },
      },
    );
    expect(actual).to.throw('"list" missing required peer "query"');
  });

  it('should throw on missing data', () => {
    const actual = () => extractFromHTML(
      getHTML(),
      {
        query: '.grid-item',
      },
    );
    expect(actual).to.throw('child "data" fails because ["data" is required]');
  });
});
