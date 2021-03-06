const User = require('../models/user');

// Render registration form
module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

// Create a user with the submitted data and save to database
module.exports.registerUser = async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username})
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelpcamp!');
        res.redirect('/campgrounds');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

// Render login form
module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

// Login user
module.exports.login = async(req, res) => {
    req.flash('success', "Welcome back!");
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// Logout
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are signed out');
    res.redirect('/campgrounds');
}