var express = require('express');
var fs = require('fs');
var path = require('path');
var SourceforgeRepositories = require('../SourceforgeRepositories.js');

var router = express.Router();

router.get(['/', '/latest'], function (req, res, next) {
    var latest = new SourceforgeRepositories().latest();
    if (latest == null) {
        res.json({});
    } else {
        fs.readFile(path.resolve(latest), "utf-8", function (err, data) {
            if (err) {
                return console.log(err);
            }

            res.json(JSON.parse(data));
        });
    }
});

router.get('/retrieve', function (req, res, next) {
    res.send(new SourceforgeRepositories().retrieve());
});

router.get('/update', function (req, res, next) {
    res.send(new SourceforgeRepositories().update())
});

router.get('/retrieveAndUpdate', function (req, res, next) {
    res.send(new SourceforgeRepositories().retrieveAndUpdate());
});

module.exports = router;
