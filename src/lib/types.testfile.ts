/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any */
import type { ExtractConfig, GetRecord, GetStructure } from './types';

const config: ExtractConfig = {
  query: '.grid-item',
  self: {
    id: { attr: 'data-id', convert: 'number' as const },
  },
  data: {
    title: 'h2',
    description: { query: 'p', html: true },
    description2: { query: 'p', convert: 'date' as const },
    description3: { query: 'p', convert: parseFloat },
    tags: { query: '.tags > .tag', list: true },
    image: (extract) => ({
      src: extract('.js-image', { attr: 'src' }),
      alt: extract('.js-image', { attr: 'alt' }),
    }),
    image2: (extract) =>
      extract('.js-image', {
        data: { src: 'src', alt: 'alt' },
      }),
    link: {
      query: 'a',
      data: {
        href: 'href',
        target: 'target',
        text: true,
        foo: { attr: 'data-test', convert: 'number' as const },
        bar: { attr: 'data-test', convert: parseFloat },
      },
    },
  },
};

type E = GetStructure<typeof config>;
type E1 = GetRecord<typeof config['data']>;
// type E1 = GetRecord<typeof config['data']['link']['data']>;

const x: E = 1 as any;
// x.link.
