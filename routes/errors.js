var express = require('express');

exports.init = function() {

    var router = express.Router();

    // 404 Page Not Found
    router.use(function(req, res) { // 404 routing. "console.warn()" is equivalent to "console.error"
        console.warn('404 Page Evaporated: %s', req.orginalUrl);
        res.status(404).render('index', {
            notification: {
                severity: "error",
                message: "Excuse me, I am sorry to inform you that your page disappeared despite our best efforts. Next time perhaps!"
            }
        });
    });

    // 500 Server Internal Error
    router.use(function(err, req, res, next) { // Internal Server error
            console.log(err.stack);

            res.status(500).render('index', {
                notification: {
                    severity: "error",
                    message: "The Force is strong with this one.\n Let us regroup and then retry!"
                }
            })
        })

    return router;
};