const express = require('express');
const router = express.Router();
const Seat = require('../../models/seats');
const walkIn = require('../../models/walkIn');

// Seat numbers in each lab
const labs = [
    {
        labID: 300,
        seatList: ["A1", "A2", "A3", "A4", "A5"]
    },
    {
        labID: 301,
        seatList: ["B1", "B2", "B3", "B4", "B5"]
    },
    {
        labID: 302,
        seatList: ["C1", "C2", "C3", "C4", "C5"]
    },
] 

router.get('/', async (req, res) => {
    try{
        const seats = await Seat.find({}).populate('reservedBy')
        res.json(seats)
    }catch(error){
        console.log(error)
    }
})

router.post('/create-seat', async (req, res) => {
    try{
        const newseat = await Seat.create(req.body)
        res.status(200).json(newseat)
    }catch(error){
        res.status(500).json({message: "Error in creating new seat"})
    }
})

// Testing updates feature for MongoDB
router.put('/update-seat', async (req, res) => {
    try{
        const useat = await Seat.findOne({labID: "144"})

        if(!useat){
            console.log("D.N.E")
            return res.status(404).json({message: "seat not found"})
        }else{
            useat.seatList.forEach(i => {
                i.reservedBy = "NewName"
            })
            await useat.save()
            res.json(useat)
            return res.status(200)
        }

    }catch(error){
        res.status(500).json({message: "Error, could not update"})
    }
})

router.get('/slots/:id/:day', async (req, res) => {
    const { id, day } = req.params;
    
    try{
        const arr = await Seat.find({ labID: id, day: day }).populate('reservedBy').lean().exec();
        res.json(arr);
    }catch(e){
        console.log(e)
    }
})

router.get('/slots/:id', async (req, res) => {
    try{
        let {id} = req.params
        id = parseInt(id)
        
        let arr
        for(let lab of labs){
            if(lab.labID === id){
                arr = lab.seatList
            }
        }
        res.json(arr)
    }catch(e){
        console.log(e)
    }
})

router.post('/reserve', async(req, res) => {
    try{
        let data = req.body
        
        await Seat.create(data)
        res.status(200)
        res.json({message: "Successfully updated lab reservations"})
    }catch(e){
        console.log(e)
        res.status(500)
    }
});

router.get('/find-lab/:id', async(req, res) => {
      let { id } = req.params
      id = parseInt(id)

      try{
        let list = await Seat.find({ labID: id })
        res.json(list)
      }catch(e){
        console.log(e)
      }
})

router.post('/reserve-for', async(req, res) => {
    let data = req.body;

    try{
        const newWalkIn = await walkIn.create(data);
        res.status(200).json(newWalkIn);
    }catch(e){
        console.log(e)
        res.status(500).json({message: "Could not create reservation."})
    }
});

router.get('/find-walkin/:id', async(req, res) => {
    let { id } = req.params
    id = parseInt(id)

    try{
      const list = await walkIn.find({ labID: id })
      res.json(list)
    }catch(e){
      console.log(e)
    }
});

router.get('/walk-ins', async(req, res) => {
    try{
        const list = await walkIn.find({})
        res.json(list)
    }catch(e){
        console.log(e)
    }
});

router.delete('/remove-res', async(req, res) => {
    let data = req.body

    try{
        const found = await Seat.findOne({
            labID: data.labID,
            seatID: data.seatID,
            day: data.day,
            startTime: data.startTime,
            endTime: data.endTime,
            status: "Unavailable",
        })

        if(!found){
            res.status(404).json({ message: "Reservation not found" });
        }else{
            await Seat.deleteOne({
                labID: data.labID,
                seatID: data.seatID,
                day: data.day,
                startTime: data.startTime,
                endTime: data.endTime,
                status: "Unavailable",});
            res.status(200).json({ message: "Successfully deleted reservation" });
        }
    }catch(e){
        console.log(e);
        res.status(500).json({ message: "Error in deleting reservation" })
    }
});

router.delete('/remove-walkin', async(req, res) => {
    let data = req.body

    try{
        const found = await walkIn.findOne({
            labID: data.labID,
            seatID: data.seatID,
            day: data.day,
            startTime: data.startTime,
            endTime: data.endTime,
            status: "Unavailable",});
        if(!found){
            res.status(404).json({ message: "Reservation not found"});
        }else{
            try{
                await walkIn.deleteOne({
                    labID: data.labID,
                    seatID: data.seatID,
                    day: data.day,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    status: "Unavailable",});
            }catch(e){
                console.log(e)
            }
            res.status(200).json({ message: "Successfully deleted reservation" });
        }
    }catch(e){
        console.log(e);
        res.status(500).json({ message: "Error in deleting reservation" })
    }
});

router.patch('/update-res', async(req, res) => {
    const data = req.body

    let filter = {
        labID: data.labID,
        seatID: data.seatID,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        status: "Unavailable",};

    let update = {
        labID: data.newLab,
        day: data.newDay,
        seatID: data.newSeat,
        startTime: data.newTimein,
        endTime: data.newTimeout
    };

    try{
        await Seat.findOneAndUpdate(filter, update)
        res.status(200).json({ message: "Sucessfully updated reservation" })
    }catch(e){
        console.log(e)
        res.status(400).json({ message: "Error in updating reservation" })
    }
});

router.patch('/update-walkin', async(req, res) => {
    const data = req.body

    let filter = {
        labID: data.labID,
        seatID: data.seatID,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        status: "Unavailable",};

    let update = {
        labID: data.newLab,
        seatID: data.newSeat,
        startTime: data.newTimein,
        endTime: data.newTimeout,
        day: data.newDay
    };

    try{
        await walkIn.findOneAndUpdate(filter, update)
        res.status(200).json({ message: "Sucessfully updated reservation" })
    }catch(e){
        console.log(e)
        res.status(400).json({ message: "Error in updating reservation" })
    }
})

module.exports = router;
