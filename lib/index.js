const Knex = require('knex');
const JSONStream = require('JSONStream');
const jsonToCsv = require('json-to-csv-stream');
const { pipeline } = require('stream');

module.exports.attachToStreamCSV = function attachToStreamCSV() {
    Knex.QueryBuilder.extend('toStreamCSV', function toStreamCSV(writableStream, options) {
        return new Promise(async (resolve, reject) => {
            options = options || {};

            if (this._method !== 'select') {
                return reject(new Error('ToStreamCSV error: should be used only with select query.'));
            }

            const { sql, bindings } = this.toSQL();
            const knexStream = this.client.raw(sql, bindings).stream();

            pipeline(knexStream, JSONStream.stringify(), jsonToCsv(options), writableStream, error => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve();
                }
            });
        });
    });
};