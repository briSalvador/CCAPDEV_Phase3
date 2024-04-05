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

        let html = `
            <ul class="reserveDetails">
                <span class="resNum">Reservation ${i.resNum}</span>
                <li class="seatNum">Seat Number: ${i.seatID}</li>
                <li class="lab">Laboratory: Lab ${i.labID}</li>
                <li>Reserved by: ${i.reservedBy}</li>
                <li class="reserveDate">Time Slot: ${i.day}, ${convertToAMPM(i.startTime)} - ${convertToAMPM(i.endTime)}</li>
                <div>
                    <button type="submit" class="btn" id="${i.resNum}" name="${i.resNum}">Remove</button>
                </div>
            </ul>
        `
        resBox.innerHTML += html
        viewContainer.appendChild(resBox)
    }
}

document.addEventListener('DOMContentLoaded', async function(){
    let reservations = []
    let form = document.querySelector('#removeRes')
    let resNum = 0

    try{
        const res = await fetch('/labs')
        const data = await res.json()

        for(let i of data){
            resNum++
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
        }
    }catch(error){
        console.log(error)
    }

    try{
        const res2 = await fetch('/labs/walk-ins')
        const data2 = await res2.json()
        console.log(data2)

        for(let i of data2){
            resNum++
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
        }
    }catch(error){
        console.log(error)
    }

    loadReservations(reservations)

    // Find which remove button was clicked
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            console.log(`Form ${form.id} was clicked`);
            let r = reservations[form.id-1];
            console.log(r)
            let result = confirm("Are you sure you want to delete this reservation?");
            let success = false;
            if(result){
                try{
                    const remove_seat = await fetch(`/labs/remove-res`, {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify(r)
                      });
                    const seat_result = await remove_seat.json()

                    if (remove_seat.ok){ 
                        alert(seat_result.message)
                        success = true 
                    } 

                }catch(e){
                    console.log(e)
                }

                if(!success){
                    try{
                        const remove_walkin = await fetch(`/labs/remove-walkin`, {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify(r)
                          });
                        const walkin_result = await remove_walkin.json()
    
                        alert(walkin_result.message)
                    }catch(e){
                        console.log(e)
                    }
                }

                location.reload();
            } 
        });
    });
})