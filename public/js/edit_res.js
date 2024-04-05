function convertToAMPM(time) {
    // Split the time into hours and minutes
    let [hours, minutes] = time.split(':').map(Number);

    // Determine AM or PM
    let period = hours < 12 ? 'AM' : 'PM';

    // Convert hours from military time to standard time
    hours = hours % 12 || 12;

    // Return the time in AM/PM format
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
}

function loadReservations(reservations){
    let viewContainer = document.querySelector('.viewContainer')
    viewContainer.innerHTML = ''

    for(let i of reservations){
        let resBox = document.createElement('form')
        resBox.className = 'reservationBox'
        resBox.id = i.resNum
        reservationNum = parseInt(i.resNum)+1

        let html = `
            <ul class="reserveDetails">
                <span class="resNum">Reservation ${reservationNum}</span>
                <li class="seatNum">Seat Number: ${i.seatID}</li>
                <li class="lab">Laboratory: Lab ${i.labID}</li>
                <li>Reserved by: ${i.reservedBy}</li>
                <li class="reserveDate">Time Slot: ${i.day}, ${convertToAMPM(i.startTime)} - ${convertToAMPM(i.endTime)}</li>
                <div>
                    <button type="submit" class="btn" id="${i.resNum}" name="${i.resNum}">Edit</button>
                </div>
            </ul>
        `
        resBox.innerHTML += html
        viewContainer.appendChild(resBox)
    }
}

// Returns true if there is overlap and false if there is none
function checkOverlap(timePeriod1, timePeriod2) {
    // Split the time periods into start and end times
    let [start1, end1] = timePeriod1.split('-').map(time => new Date(`1970-01-01T${time}:00Z`).getTime());
    let [start2, end2] = timePeriod2.split('-').map(time => new Date(`1970-01-01T${time}:00Z`).getTime());

    // Check for overlap
    if (start1 <= end2 && start2 <= end1) {
        return true;  // Times overlap
    } else {
        return false; // Times do not overlap
    }
}

document.addEventListener('DOMContentLoaded', async function(){
    let reservations = []
    let resNum = 0

    try{
        const res = await fetch('/labs')
        const data = await res.json()

        for(let i of data){
            let reserve = {
                resNum: `${resNum}`,
                labID: `${i.labID}`,
                day: `${i.day}`,
                seatID: `${i.seatID}`,
                startTime: `${i.startTime}`,
                endTime: `${i.endTime}`,
                reservedBy: `${i.reservedBy.username}`,
            }
            
            reservations.push(reserve)
            resNum++
        }
    }catch(error){
        console.log(error)
    }

    try{
        const res2 = await fetch('/labs/walk-ins')
        const data2 = await res2.json()
        console.log(data2)

        for(let i of data2){
            let reserve = {
                resNum: `${resNum}`,
                labID: `${i.labID}`,
                day: `${i.day}`,
                seatID: `${i.seatID}`,
                startTime: `${i.startTime}`,
                endTime: `${i.endTime}`,
                reservedBy: `${i.reservedBy}`
            }
            reservations.push(reserve)
            resNum++
        }
    }catch(error){
        console.log(error)
    }

    loadReservations(reservations)

    // Find which remove button was clicked
    const forms = document.querySelectorAll("form");
    let modal = document.getElementById('modal')
    let close = document.querySelector('.close')
    let save = document.getElementById('save')

    close.addEventListener('click', function(){
        modal.style.display = 'none'
    })

    forms.forEach(form => {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            console.log(`Form ${form.id} was clicked`);
            let r = reservations[form.id]
            console.log(reservations.length)
            
            modal.style.display = 'block'

            save.addEventListener('click', async function(e){
                let result = confirm("Are you sure you want to save changes?");
                
                if(result){
                    e.preventDefault();
                  
                    const seatNumber = document.getElementById('seat-number').value;
                    const labNumber = document.getElementById('lab-number').value;
                    const timein = document.getElementById('time-in').value;
                    const timeout = document.getElementById('time-out').value;
                    const day = document.getElementById('day_select').value;

                    if(seatNumber !== ""){
                        r.newSeat = seatNumber
                    }else{
                        r.newSeat = r.seatID
                    }
                    
                    if(labNumber !== ""){
                        r.newLab = labNumber
                    }else{
                        r.newLab = r.labID
                    }

                    if(timein !== ""){
                        r.newTimein = timein
                    }else{
                        r.newTimein = r.startTime
                    }

                    if(timeout !== ""){
                        r.newTimeout = timeout
                    }else{
                        r.newTimeout = r.endTime
                    }

                    if(day !== ""){
                        r.newDay = day
                    }else{
                        r.newDay = r.day
                    }
                    
                    console.log(`Seat Number: ${r.newSeat}, Lab Number: ${r.newLab}, Time Period: ${r.newTimein} - ${r.newTimeout}, day: ${r.newDay}`);
                    let conflict = false
                    try{
                        const res = await fetch(`/labs/find-lab/${r.newLab}`);
                        const data = await res.json();

                        // Checks if the user's reservation conflicts with another
                        // existing reservation that was already made
                        for(let i of data){
                            if(r.newSeat === i.seatID && r.newDay === i.day){
                                let p1 = r.newTimein + "-" + r.newTimeout
                                let p2 = i.startTime + "-" + i.endTime

                                console.log(p1)
                                console.log(p2)
                                console.log(checkOverlap(p1, p2))

                                if(checkOverlap(p1, p2)){
                                    conflict = true; 
                                    break;
                                }
                            }
                        }

                        const res2 = await fetch(`/labs/find-walkin/${r.newLab}`);
                        const data2 = await res2.json();

                        // Checks if the user's reservation conflicts with another
                        // existing reservation that was already made
                        for(let i of data2){
                            if(r.newSeat === i.seatID && r.newDay === i.day){
                                let p1 = r.newTimein + "-" + r.newTimeout
                                let p2 = i.startTime + "-" + i.endTime

                                console.log(p1)
                                console.log(p2)
                                console.log(checkOverlap(p1, p2))

                                if(checkOverlap(p1, p2)){
                                    conflict = true; 
                                    break;
                                }
                            }
                        }
                    }catch(e){
                        console.log(e)
                    }
                    
                    if(!conflict){
                        let success = false
                        try{
                            const update = await fetch(`/labs/update-res`, {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify(r)
                              });
                            const result = await update.json()
        
                            if(result.ok){ 
                                alert(result.message)
                                success = true 
                            }
        
                        }catch(e){
                            console.log(e)
                        }

                        if(!success){
                            try{
                                const updateWalkin = await fetch(`/labs/update-walkin`, {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(r)
                                  });
                                const resultWalkin = await updateWalkin.json()
            
                                if(resultWalkin.ok){ 
                                    alert(resultWalkin.message)
                                    success = true 
                                }else{
                                    alert(resultWalkin.message)
                                }
            
                            }catch(e){
                                console.log(e)
                            }
                        }
                    }else{
                        alert("Cannot edit, there is conflict in schedules")
                    }
            
                    modal.style.display = 'none';
                    location.reload()
                }else{
                    modal.style.display = 'none'
                }
            });
        });
    });
})