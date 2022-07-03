const knex = require('knex');
const dotenv = require('dotenv');
const fs = require('fs');
const { attachToStreamCSV } = require('../lib/index');

attachToStreamCSV()

if (process.env.CI !== 'true') {
    dotenv.config('../.env');
}

const db = knex({
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
});

describe('toStreamCSV', () => {
    beforeAll(() => {
        try {
            fs.unlinkSync('/tmp/ToStreamCSV.csv');
        }
        catch(e) {}
    });

    afterAll(() => db.destroy());

    describe('validation', () => {
        it('should throw if applied to none select query', async () => {
            expect.assertions(1);
            await db('test_users').insert({id: 1}).toStreamCSV()
                .catch(e => {
                    expect(e).toEqual(new Error('ToStreamCSV error: should be used only with select query.'))
                })
        });
    });

    describe('behaviour', () => {
        it('should stream rows as CSV', async () => {
            expectedString = 'id,name,email\n1,foo,foo@bar.com\n2,foo2,foo2@bar.com\n3,foo3,foo3@bar.com\n';

            writeStream = fs.createWriteStream('/tmp/ToStreamCSV.csv');
            await db.select().from('test_users').toStreamCSV(writeStream);

            expect(fs.readFileSync('/tmp/ToStreamCSV.csv', 'utf-8')).toEqual(expectedString);
        });
        
        it('should stream rows as CSV with delimiter "|"', async () => {
            expectedString = 'id|name|email\n1|foo|foo@bar.com\n2|foo2|foo2@bar.com\n3|foo3|foo3@bar.com\n';

            writeStream = fs.createWriteStream('/tmp/ToStreamCSV.csv');
            await db.select().from('test_users').toStreamCSV(writeStream, {csv: {separator: '|'}});

            expect(fs.readFileSync('/tmp/ToStreamCSV.csv', 'utf-8')).toEqual(expectedString);
        });
    });
});