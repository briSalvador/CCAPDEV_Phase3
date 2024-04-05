const express = require('express')
const router = express.Router();
const Seat = require("../../models/seats");

router.get('/error', (req, res) => {
    res.render('error', {layout : 'main'});
})

router.get('/login', (req, res) => {
    res.render('login', {layout : 'main'});
})

router.get('/register', (req, res) => {
    res.render('register', {layout : 'main'});
})

router.get('/', authMiddleware('Visitor'), (req, res) => {
    res.render('homepage', {layout : 'main'});
});

router.get('/reserve-labs', authMiddleware('Visitor'), (req, res) => {
    res.render('reserve', {layout : 'main2'});
});

router.get('/view-slots', authMiddleware('Visitor'), (req, res) => {
    res.render('viewSlot', {layout: 'main2'});
});

router.get('/search-users', authMiddleware('Visitor'), (req, res) =>{
    res.render('searchUser', {layout: 'main2'})
});

router.get('/reserve-for', authMiddleware('Visitor'), (req, res) => {
    res.render('reservefor', {layout: "main2"})
});

router.get('/remove-menu', authMiddleware('Visitor'), (req, res) => {
    res.render('removemenu', {layout: "main2"})
});

router.get('/remove-reservation', authMiddleware('Admin'), (req, res) => {
    res.render('removeRes', {layout: "main2"})
});

router.get('/profile', authMiddleware('Visitor'), async(req, res) => {
    const user = req.session.user;
    const user_id = user._id;
    const seats = await Seat.find({reservedBy: user_id}).lean().exec()

    console.log(seats)
    res.render('profile', {layout: "main2", user, seats})
});

router.get('/edit-res', authMiddleware('Visitor'), (req, res) => {
    res.render('edit_res', {layout: "main2"})
});

router.get('/edit-profile', authMiddleware('Visitor'), async (req, res) => {
    const user = req.session.user;
    const user_id = user._id;
    const seats = await Seat.find({reservedBy: user_id}).lean().exec()

    console.log(seats)
    res.render('edit-profile', {layout: "main2", user, seats})
})

module.exports = router;

// Middleware function for authentication
function authMiddleware(requiredRole) {
    return (req, res, next) => {
        const user = req.session.user;
        if(!user) {
            // User is not logged in
            res.redirect('/login');
        } else if(user.role === 'Admin') {
            // User is an admin and can access all pages
            next();
        } else if(user.role !== requiredRole) {
            // User is logged in but doesn't have the correct role
            res.redirect('/error');
        } else {
            // User is logged in and has the correct role
            next();
        }
    };
}