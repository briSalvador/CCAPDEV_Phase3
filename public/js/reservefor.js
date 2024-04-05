
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

function selectedButton(e){
    console.log(e.target.value)
}

document.addEventListener('DOMContentLoaded', function() {
    const form2 = document.getElementById('r1')
    const labList = document.querySelector("#labs")
    const dayList = document.querySelector('#day_select')

    form2.addEventListener("submit", async function(e){
        e.preventDefault()
        let labID = labList.value
        labID = labID.split(" ")
        labID = labID[1]

        let startTime = document.querySelector('input#startTime').value
        let endTime = document.querySelector('input#endTime').value
        let day = dayList.value
        let seat = document.getElementsByName('seat')

        let currUser = document.querySelector('.text_field').value

        for(i = 0; i < seat.length; i++){
            if(seat[i].checked){seat = seat[i].value}
        }

        let reserve = {
            labID: `${parseInt(labID)}`,
            seatID: `${seat}`,
            day: `${day}`,
            startTime: `${startTime}`,
            endTime: `${endTime}`,
            status: "Unavailable",
            reservedBy: `${currUser}`
        }

        let conflict = false
        try{
            const res = await fetch(`/labs/find-lab/${labID}`);
            const data = await res.json();

            // Checks if the user's reservation conflicts with another
            // existing reservation that was already made
            for(let i of data){
                if(seat === i.seatID && day === i.day){
                    let p1 = startTime + "-" + endTime
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

            const res2 = await fetch(`/labs/find-walkin/${labID}`);
            const data2 = await res2.json();

            // Checks if the user's reservation conflicts with another
            // existing reservation that was already made
            for(let i of data2){
                if(seat === i.seatID && day === i.day){
                    let p1 = startTime + "-" + endTime
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

            if(conflict){
                alert("Reservation failed. Current reservation may have conflicts with other reservations.")
                console.log("conflict")
            }else{
                try {
                    const res = await fetch(`/labs/reserve-for`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(reserve)
                    });
                    const data = await res.json();
                
                    if (!res.ok) {
                      throw new Error("HTTP error " + res.status);
                    }

                    console.log(data.message)
                    alert("Successfully reserved lab!")
                } catch (error) {
                    alert("Reservation failed.")
                    console.error("There was a problem with the PATCH request:", error);
                }
            }
        }catch(error){
            console.log(error)
        }
    })

    labList.addEventListener("change", async function(e){
        e.preventDefault();
        let table = document.querySelector("#table")
        let lab = labList.value
        let seatsPanel = document.querySelector('#seats')

        seatsPanel.innerHTML = ' '

        console.log(lab)
        if(lab === ""){
            seatsPanel.innerHTML = '<span>Please select a lab.</span>'
        }else{
            lab = lab.split(" ")
            lab = lab[1]

            try{
                const res = await fetch(`/labs/slots/${lab}`)
                const data = await res.json(); // data is an array of labs

                let seats = data
                
                for(let i of seats){
                    let seatButtons = document.createElement('li')
                    let button = document.createElement('input')
                    button.type = 'radio'
                    button.value = i
                    button.id = i
                    button.name = 'seat'
                    button.setAttribute("onchange", "selectedButton(event)")

                    let label = document.createElement('label')
                    label.htmlFor = button.id
                    label.innerHTML = i

                    seatButtons.appendChild(button)
                    seatButtons.appendChild(label)
                    seatsPanel.appendChild(seatButtons)
                }
            }catch(err){
                console.log(err)
            }
        }
    })
});