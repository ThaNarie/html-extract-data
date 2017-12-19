[![Travis](https://img.shields.io/travis/ThaNarie/html-extract-data.svg?maxAge=2592000)](https://travis-ci.org/ThaNarie/html-extract-data)
[![npm](https://img.shields.io/npm/v/html-extract-data.svg?maxAge=2592000)](https://www.npmjs.com/package/html-extract-data)
[![npm](https://img.shields.io/npm/dm/html-extract-data.svg?maxAge=2592000)](https://www.npmjs.com/package/html-extract-data)

# html-extract-data

Extract data from the DOM using a JSON config


## Installation

```sh
yarn add html-extract-data
```

```sh
npm i -S html-extract-data
```

## Usage

### Basic
```ts
import extractFromHTML from 'html-extract-data';

extractFromHTML(
  html, // a HTML DOM element
  {
    query: '.grid-item',
    data: {
      title: 'h2',
      description: { query: 'p', html: true },
    }
  },
);

// Output:
{
  title: 'title',
  description: 'description <b>bold</b>'
}
```

### Advanced
```ts
import extractFromHTML from 'html-extract-data';

const data = extractFromHTML(
  // a HTML DOM element
  html,
  {
    // query element within the html
    query: '.grid-item',
    
    // if list, it will use querySelectorAll and return an array
    list: true,
    
    // extract dat (mostly attributes) from the element itself
    self: {
    
      // grab the `data-category` attribute and put it in the `category` field
      'category': 'data-category',
      
      // convert the value to a number
      'id': { attr: 'data-id', convert: 'number' },
    }
    
    // extract extra data from child elements
    data: {
    
      // get the text value from the `h2` element
      title: 'h2',
      
      // get the html value from the `p` element
      description: { query: 'p', html: true },
      
      // get the text value from the `.tag` elements, and return as an array
      tags: { query: '.tags > .tag', list: true },

      // option to convert your extracted value, provide a user function      
      price: { query: '.price', convert: parseFloat }
      
      // or use any of the built-in converts (number, float, boolean, date)
      date: { query: '.date', convert: 'date' }
      
      // when passed a function, you can do your own logic,
      // extract and process any information you want, and return a value
      // the extract function passed is bould to the parent element
      // the parent element itself is also passed
      image: (extract, element) => ({
      
        // in here you can call and pass the same information as above
        alt: extract({ query: '.js-image', attr: 'alt' }),
        
        // or use the shorthand syntax
        src: extract('.js-image', { attr: 'src' }),
      }),
      
      // alternative option for the above
      image2: (extract) =>
      
        // if we just want to exract info from a single element
        // we can just pass a data object with shorthand extracts (see below)
        extract('.js-image', {
          data: { src: 'src', alt: 'alt' }
        }),
      // use the shorthand syntax to extra information from a single element
      link: {
        // specify the query to that element
        query: 'a',
        data: {
        
          // when passed a string, it will extract the attribute
          href: 'href',
          
          // when passed as object, it will do the same as normal
          target: { attr: 'target', convert: 'number' },
          
          // when passed true, it will grab the text content
          text: true,
          
          // this will extract the HTML content
          value: { html: true },
        },
      },
    },
  },
  
  // pass an additional object that will be merged in each extracted item
  {
    // normal property
    visible: false,
    
    // allows deep merging (this prepends a default value to the array)
    tags: ['select a value']
  }
);
```

Will output:
```
[{
  category: 'js',
  id: 1,
  title: 'title',
  description: 'description <b>bold</b>',
  tags: ['select a value', 'a', 'b', 'c'],
  price: 123.45,
  date: Date(2018-20-08 ... )
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
    target: '_blank',
    text: 'google',
    value: '<b>google</b>'
  },
  visible: false
}]
```

### Production

This library uses [Joi](https://github.com/hapijs/joi) to validate the input config structure, but it's quite large.
That's why they are added within `process.env.NODE_ENV !== 'production'` checks, which means
that your build process can strip it out.

## Documentation

View the [unit tests](./test) to see all the possible ways this module can be used.


## Building

In order to build html-extract-data, ensure that you have [Git](http://git-scm.com/downloads)
and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/ThaNarie/html-extract-data.git
```

Change to the html-extract-data directory:
```sh
cd html-extract-data
```

Install dev dependencies:
```sh
yarn
```

Use one of the following main scripts:
```sh
yarn build            # build this project
yarn test             # run the unit tests incl coverage
yarn test:dev         # run the unit tests in watch mode
yarn lint             # run tslint on this project
```

## Contribute

View [CONTRIBUTING.md](./CONTRIBUTING.md)


## Changelog

View [CHANGELOG.md](./CHANGELOG.md)


## Authors

View [AUTHORS.md](./AUTHORS.md)


## LICENSE

[MIT](./LICENSE) © Tha Narie
