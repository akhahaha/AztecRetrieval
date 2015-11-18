var express = require('express');
var fs = require('fs');
var path = require('path');
var BioconductorPackages = require('../BioconductorPackages.js');

var router = express.Router();

router.get(['/','/latest'], function(req, res, next) {
    var latest = BioconductorPackages.latest();
    if (latest == null) {
        res.json({});
    } else {
        fs.readFile(path.resolve(latest), "utf-8", function(err, data) {
            if (err) {
                return console.log(err);
            }

            res.json(JSON.parse(data));
        });
    }
});

router.get('/retrieve', function(req, res, next) {
    res.send(BioconductorPackages.retrieve());
});

module.exports = router;