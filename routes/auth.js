const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const passport = require("passport");
const auths = require("../controllers/auth");

router.route('/register')
    .get(auths.registerForm)
    .post(catchAsync(auths.registerUser));

router.route('/login')
    .get(auths.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), catchAsync(auths.login))
    
router.get('/logout', auths.logout)

module.exports = router;