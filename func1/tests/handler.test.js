// Set env variables for tests
process.env = Object.assign(process.env, {
    DATASPACE_URL: 'DATASPACE_URL',
    APP_KEY: 'APP_KEY',
    APP_SECRET: 'APP_SECRET'
});

const {TestContext, TestEvent} = require('./test-entities')
const handler = require('../main/handler');

test('Test handler response', (done) => {
    const callback = (err, functionResult) => {
        expect(err).toBeUndefined();
        expect(context.status()).toBe(200);
        done()
    }

    const event = new TestEvent({body: "Request body"});
    const context = new TestContext(callback);
    handler(event, context)
});

