'use strict';
const {graphQLStatus} = require("./apolloClient.js");
const fs = require('fs');
const path = require('path');

// Expose custom metric///
const promClient = require('prom-client');
const callCounter = new promClient.Counter({name: 'call_counter', help: 'Handler call count'});

const handler = async (event, context) => {
    callCounter.inc();
    /*console.log(filePath);*/
    
    fs.readFile("README.MD", {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        console.log('received data: ' + data);
        /*response.writeHead(200, {'Content-Type': 'text/txt'});
        response.write(data);
        response.end();*/
    } else {
        console.log(err);
    }
});

    return context
        .status(200)
        .succeed(event.body);
};

module.exports = handler;