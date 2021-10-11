class TestEvent {
    constructor(req) {
        this.body = req.body;
        this.headers = req.headers;
        this.method = req.method;
        this.query = req.query;
        this.path = req.path;
    }
}

class TestContext {
    constructor(cb) {
        this.statusValue = 200;
        this.cb = cb;
        this.headerValues = {};
        this.cbCalled = 0;

        this.asFile = false;
    }

    status(value) {
        if (!value) {
            return this.statusValue;
        }

        this.statusValue = value;
        return this;
    }

    headers(value) {
        if (!value) {
            return this.headerValues;
        }

        this.headerValues = value;
        return this;
    }

    succeed(value) {
        this.cbCalled++;
        this.asFile = false;
        this.cb(undefined, value);
    }

    succeedFile(value) {
        this.cbCalled++;
        this.asFile = true;
        this.cb(undefined, value);
    }

    fail(value) {
        this.cbCalled++;
        this.cb(value, undefined);
    }
}

module.exports = {TestEvent, TestContext};