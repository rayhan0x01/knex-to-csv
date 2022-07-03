# knex-to-csv

![npm](https://img.shields.io/npm/v/knex-to-csv)

Adds the .toStreamCSV() function to Knex's query builder to stream rows from Knex in CSV format to a writable stream.

## Install

```
$ npm i knex-to-csv --save
```

## Setup

Import and call the `attachToStreamCSV()` function after importing Knex:

```javascript
const knex = require('knex');
const {attachToStreamCSV} = require('knex-to-csv');
attachToStreamCSV();
```

## Usage

Export Knex rows to a CSV file:

```javascript
const fs = require('fs')

csvWriter = fs.createWriteStream('/tmp/export.csv');

await knex.select().from('users').toStreamCSV(csvWriter)

// or with promise
knex.select().from('users').toStreamCSV(csvWriter)
    .then(() => {
        console.log('CSV exported successfully!');
    })
    .catch(e => {
        console.log(e);
    })

```

Specify CSV options and export Knex result rows to a CSV file:

```javascript
const fs = require('fs')

csvWriter = fs.createWriteStream('/tmp/export.csv');

await knex.select().from('users').toStreamCSV(csvWriter, {csv: {separator: '|', newline: '\n'}})
```

## Note

From Knex.js [documentation](http://knexjs.org/guide/interfaces.html#streams):

> If you wish to use streams with PostgreSQL, you must also install the pg-query-stream module. If you wish to use streams with the pgnative dialect, please be aware that the results will not be streamed as they are received, but rather streamed after the entire result set has returned. On an HTTP server, make sure to manually close your streams if a request is aborted.

## API

```javascript
toStreamCSV(writableStream, options?): Promise<number>
```

#### writableStream

Any writable stream or Duplex stream that implements the [stream.Writable](https://nodejs.org/api/stream.html#class-streamwritable) class such as `fs` write streams, `http` ServerResponse, TCP sockets, Zlib streams, etc.

#### options
Type: `object`

Default: `{}`

Keys: `path`, `csv`

- `path`

  Type: `any`

  Default: `undefined`

  A path for [JSONStream.parse](https://github.com/dominictarr/JSONStream#jsonstreamparsepath)

- `csv`

  Type: `object`

  Default: `{separator: ',', newline: '\n', headers: undefined, sendHeaders: true}`

  Options to pass to [csv-write-stream](https://github.com/maxogden/csv-write-stream#var-writer--csvwriteroptions)

## License

[MIT](https://github.com/rayhan0x01/knex-to-csv/blob/HEAD/LICENSE)

## Acknowledgements

This library was inspired from the following libraries:

* [`knex-on-duplicate-update`](https://www.npmjs.com/package/knex-on-duplicate-update)
* [`json-to-csv-stream`](https://www.npmjs.com/package/json-to-csv-stream)