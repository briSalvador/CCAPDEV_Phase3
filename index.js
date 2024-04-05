const express = require('express')
const session = require('express-session');
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const apiRoutes = require('./server/routes/api.routes')
const app = express();
const Seat = require('./models/seats');
const User = require("./models/user");

// Use sessions
app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using HTTPS
}));

app.set('views', 'views')
app.use(express.static(__dirname + '/public'));

// set `hbs` as view engine
app.set('view engine', 'hbs');

// sets `/client/layouts` as directory containing layout hbs files
// sets `/client/partials` as directory containing partial hbs files
app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/',
}));

app.use(
    express.urlencoded({ extended: true })
);
app.use(express.json());
app.use('/', apiRoutes);

const port = process.env.port || 3000;

mongoose.connect("mongodb+srv://briannasalvador:zX6QAI6aQdCKmvcR@labrevdb.ivomuhq.mongodb.net/LabRevDB?retryWrites=true&w=majority&appName=LabRevDB")
.then(() => {
    console.log("Connected to the database!")
    app.listen(port, ()=>{
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch(() => {
    console.log("Error in connecting to the database.")
})


// Creates sample data when running the server

const seat_samples = [
    {
        labID: 301,
        seatID: "B1",
        day: "Monday",
        startTime: "12:00",
        endTime: "13:00",
        status: "Unavailable"
    },
    {
        labID: 300,
        seatID: "A3",
        day: "Wednesday",
        startTime: "15:00",
        endTime: "17:00",
        status: "Unavailable"
    },
    {
        labID: 302,
        seatID: "D2",
        day: "Friday",
        startTime: "10:00",
        endTime: "13:00",
        status: "Unavailable"
    },
]

const user_samples = [
    {
        username: "brandy",
        password: 'password',
        firstname: 'Brianna',
        lastname: 'Salvador',
        role: 'Admin',
        email: 'brisalvador@gmail.com'
    },
    {
        username: "hello",
        password: '123',
        firstname: 'Rey',
        lastname: 'Reyes',
        role: 'Visitor',
        email: 'reyesR@gmail.com'
    },
    {
        username: "newPerson",
        password: '444',
        firstname: 'Anakin',
        lastname: 'Skywalker',
        role: 'Visitor',
        email: 'skywalker@gmail.com'
    },
];

async function init_users(){
    try{
        for (const sample of user_samples) {
            const existingUser = await User.findOne({ username: sample.username });
            if (!existingUser) {
                const newUser = new User(sample);
                await newUser.save();
                //console.log(newUser)
                //console.log(newUser._id.toString())
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function init_seats(){
    try{
        for (const sample of seat_samples) {
            const existingSeat = await Seat.findOne(sample);
            if (!existingSeat) {
                const newSeat = new Seat(sample);
                await newSeat.save();
            }
        }
        // let seats = await Seat.find({}).populate('reservedBy').exec()
    }catch (e) {
        console.log(e);
    }
}

async function init_res(){
    try{
        const userList = await User.find({}).exec();
        const seatList = await Seat.find({}).exec();

        for(i=0; i<seatList.length; i++){
            seatList[i].reservedBy = userList[i]._id;
            await seatList[i].save();
        }
        // console.log(await Seat.find({}).populate('reservedBy'))
    }catch(e){
        console.log(e)
    }
}

init_users()
init_seats()
init_res()