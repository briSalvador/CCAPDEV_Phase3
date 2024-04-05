document.addEventListener('DOMContentLoaded', async function(){
    let search = document.querySelector('#search')
    let table = document.querySelector('#results-table')
    let userList

    try{
        const res = await fetch(`/user`)
        const data = await res.json()
        userList = data
    }catch(error){
        console.log(error)
    }

    search.addEventListener("keyup", function(e){
        let input = this.value.toLowerCase()

        let result = userList.filter(user => user.email.toLowerCase().includes(input)
        || user.username.toLowerCase().includes(input) || user.firstname.toLowerCase().includes(input)
        || user.lastname.toLowerCase().includes(input))

        table.innerHTML = `
        <tr>
            <th class="username">Username</th>
            <th class="firstname">First Name</th>
            <th class="lastname">Last Name</th>
            <th class="email">Email</th>
        </tr>`

        for(let i of result){
            let row = document.createElement('tr')
            row.innerHTML = `
            <td>${i.username}</td>
            <td>${i.firstname}</td>
            <td>${i.lastname}</td>
            <td>${i.email}</td>
            `

            table.appendChild(row)
        }
    })

})