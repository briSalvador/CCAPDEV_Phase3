
function filterObjects(data, filters) {
    let arr = []

    if(filters.day === "" && filters.labID === ""){
        return data
    }else{
        if(filters.day !== "" && filters.labID !== ""){
            for(let i of data){
                if(i.day === filters.day && i.labID === filters.labID){
                    arr.push(i)
                }
            }
        }else if(filters.day !== "" && filters.labID === ""){
            for(let i of data){
                if(i.day === filters.day){
                    arr.push(i)
                }
            }
        }else if(filters.day === "" && filters.labID !== ""){
            for(let i of data){
                if(i.labID === filters.labID){
                    arr.push(i)
                }
            }
        }

        return arr
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector("#r1")
    const daySelect = document.querySelector("#day_select")
    const labSelect = document.querySelector("#labs")

    form.addEventListener("submit", async function(e){
        e.preventDefault();
        let currDay = daySelect.value
        let table = document.querySelector("#table")
        
        // If lab select is empty, that means no lab filter, show all labs on the selected day
        let lab = labSelect.value
        console.log(lab)

        table.innerHTML = `
            <tr>
                <th class="day">Day</th>
                <th class="timeslot">Time Slot</th>
                <th class="status">Status</th>
                <th class="reservedBy">Reserved By</th>
            </tr>
            `

        if(lab !== ""){
            lab = lab.split(" ")
            lab = lab[1]
    
            try{
                const res = await fetch(`/labs/slots/${lab}/${currDay}`)
                const data = await res.json(); // data is an array of labs
                console.log(data)
    
                if(data.length != 0){
                    for(i of data){
                        let tr = document.createElement('tr')
                        tr.innerHTML = `
                        <td>${i.day}</td>
                        <td>${i.startTime} - ${i.endTime}</td>
                        <td>${i.status}</td>
                        <td>${i.reservedBy.username}</td>
                        `
        
                        table.appendChild(tr)
                    }
                }else{
                    table.innerHTML = '<span> No existing slots <span>'
                }
            }catch(error){
                console.log(error)
            }
        }else{
            try{
                const res = await fetch(`/labs`)
                const data = await res.json(); // data is an array of labs
                console.log(data)
    
                if(data.length != 0){
                    for(i of data){
                        let tr = document.createElement('tr')
                        tr.innerHTML = `
                        <td>${i.day}</td>
                        <td>${i.startTime} - ${i.endTime}</td>
                        <td>${i.status}</td>
                        <td>${i.reservedBy.username}</td>
                        `
        
                        table.appendChild(tr)
                    }
                }else{
                    table.innerHTML = '<span> No existing slots <span>'
                }
            }catch(error){
                console.log(error)
            }
        }
    });
});