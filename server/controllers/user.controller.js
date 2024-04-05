const express = require('express');
const User = require("../../models/user");
const walkIn = require("../../models/walkIn");
const router = express.Router();

// Convert time to military for easy comparison
function convertToMilitaryTime(timeStr) {
    let [time, modifier] = timeStr.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier.toUpperCase() === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}

// Get all users (without the reservations)
/* router.get('/', async (req, res) => {
    try{
        let userList = await User.find({}).lean().exec()
        console.log(userList)
        res.json(userList)
    }catch(e){
        console.log(e)
    }
}) */


router.get('/', async (req, res) => {
    const data = await User.find({})
    res.json(data);
})

router.post('/', async(req, res) => {
    const { email, username, firstname, lastname, password } = req.body;
    if (!email || !username || !firstname || !lastname || !password) {
        return res.status(400).json({ message: "Must provide email, username, name, and password" });
    }

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email: email })
    console.log(existingUser)
    if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
    }

    const existingUsername = await User.findOne({ username: username })
    console.log(existingUsername)
    if (existingUsername) {
        return res.status(400).json({ message: "User with this username already exists" });
    }

    const role = 'Visitor';

    try{
        const user = { email: email, 
            username: username, 
            firstname: firstname, 
            lastname: lastname, 
            password: password,
            role: role };
        
        await User.create(user)
        res.status(200).json({ message: "User successfully added" });
        console.log("Successfully added user to database");
    }catch(e){
        console.log(e)
        res.status(500).json({ message: "Error in creating user" });
    }
});


// Logging in the user API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        // find the user in the database
        const user = await User.findOne({ email: email })
        console.log(user)
        if (!user) {
            console.log("Invalid email or password")
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // compare the plain text password with the stored password
        if (password !== user.password) {
            console.log("Invalid email or password")
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Stores logged in user data
        req.session.user = user;

        // if the passwords match, return a success response
        console.log("Login successful")
        res.status(200).json({ message: 'Login successful' });
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
});

router.get('/curr-user', (req, res) => {
    try{
        res.json(req.session.user)
    }catch(e){  
        console.log(e)
    }
})

router.get('/logout', (req, res) => {
    req.session.user = null;
    req.session.destroy(() => {
        res.redirect('/login')
        res.status(200)
    });
});

router.get('/search/:input', (req, res) => {
    let input = req.params.input

    let filtered = users.filter(user => user.email.includes(input) || 
    user.firstname.includes(input) || user.lastname.includes(input) ||
    user.username.includes(input))
    
    console.log(filtered)
    res.json(filtered)
})

router.post('/create-walkin', async(req, res) => {
    const data = req.body;
    try{
        await walkIn.create(data)
        res.status(200)
        res.json({message: "Successfully created walk-in student"})
    }catch(e){
        console.log(e)
        res.status(500)
    }
})

router.patch('/add-res/:obj', async(req, res) => {
    const obj = req.params.obj;
    let user = req.session.user;
    
    try{
        user = await User.findOne(user)
        user.reservations.push(obj)

        await user.save()

        res.status(200)
        res.json({message: "Successfully created added reservation"})
    }catch(e){
        console.log(e)
        res.status(500)
        res.json({message: "Error in creating reservation"})
    }
});

router.patch('/update-profile', async(req, res) => {
    const data = req.body

    try{
        const user = await User.findOne(req.session.user)
        user.username = data.username
        user.description = data.description
        await user.save()
        req.session.user = user

        res.status(200).json({ message: "Successfully updated profile" })
    }catch(e){
        console.log(e)
        res.status(500).json({ message: "Error in saving changes" })
    }
})

module.exports = router;