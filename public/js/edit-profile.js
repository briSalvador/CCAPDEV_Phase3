
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

document.addEventListener('DOMContentLoaded', function(){
    const table_data = document.getElementById('table-data')
    const rows = table_data.querySelectorAll('tr')
    const modal = document.getElementById('modal')
    const close = document.querySelector('.close')
    const form = document.querySelector('#reservation-form')
    const save_changes = document.querySelector('#save-changes')
    const back = document.querySelector('#back')

    back.addEventListener('click', function(){
        window.location.href = '/profile'
    })

    close.addEventListener('click', function(){
        modal.style.display = 'none'
    })

    for (let i = 0; i < rows.length; i++) {
        rows[i].id = `row-${i + 1}`;
    }

    let arr = []
    rows.forEach(row => {
        row.addEventListener('click', function(){
            data = row.querySelectorAll('td')
            arr = []
            data.forEach(i => {
                console.log(i.textContent)
                arr.push(i.textContent)
                modal.style.display = 'block'
            });
        })
    })

    save_changes.addEventListener('click', async function(e){
        e.preventDefault()
        const desc = document.querySelector('#desc').value
        const username = document.querySelector('#username').value
        
        let r = {
            description: `${desc}`,
            username: `${username}`
        }

        try{
            const res = await fetch('/user/update-profile', {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(r)
            });
            const result = await res.json()

            alert(result.message)
            window.location.href = '/profile'
        }catch(e){
            console.log(e)
        }
    })

    form.addEventListener('submit', async function(e){
        e.preventDefault();
        console.log("Click")
        let result = confirm("Are you sure you want to save changes?");
        
        if(result){
            const seatNumber = document.getElementById('seat-number').value;
            const labNumber = document.getElementById('lab-number').value;
            const timein = document.getElementById('time-in').value;
            const timeout = document.getElementById('time-out').value;
            const day = document.getElementById('day_select').value;

            let r = {
                labID: arr[0],
                seatID: arr[1],
                day: arr[2],
                startTime: arr[3],
                endTime: arr[4]
            }
            
            if(labNumber !== ""){
                r.newLab = labNumber
            }else{
                r.newLab = arr[0]
            }

            if(seatNumber !== ""){
                r.newSeat = seatNumber
            }else{
                r.newSeat = arr[1]
            }

            if(day !== ""){
                r.newDay = day
            }else{
                r.newDay = arr[2]
            }

            if(timein !== ""){
                r.newTimein = timein
            }else{
                r.newTimein = arr[3]
            }

            if(timeout !== ""){
                r.newTimeout = timeout
            }else{
                r.newTimeout = arr[4]
            }
            
            console.log(`Seat Number: ${r.newSeat}, Lab Number: ${r.newLab}, Time Period: ${r.newTimein} - ${r.newTimeout}, day: ${r.newDay}`);
            let conflict = false
            console.log(r)
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
                    }else{
                        console.log(result.message)
                    }

                }catch(e){
                    console.log(e)
                }
            }else{
                alert("Cannot edit, there is conflict in schedules")
            }
    
            modal.style.display = 'none';
            window.location.href = '/profile'
        }else{
            modal.style.display = 'none'
        }
    })
});