var express = require('express');
var ensureLogin = require('connect-ensure-login');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;

exports.init = function(){
    
    var router = express.Router();

    router.use(function(req, res, next){
        res.set('Access-Control-Allow-Origin', '*');
        next();
    });

    ['auth', 'postRoutes', 'errors'].forEach(function(filePath){
        var route = require('./' + filePath);
        router.use(route.init());
    });
    return router;
}