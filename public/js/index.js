document.addEventListener('DOMContentLoaded', async function(){
    try{
        const res = await fetch('/user/curr-user')
        const data = await res.json()

        if(data.role === 'Visitor'){
            let elements = document.getElementsByClassName('admin')
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = 'none';
            }
        }else if(data.role === 'Admin'){
            let dropdown = document.querySelector('.dropdown-content')
            dropdown.style.height = "150px"
        }
    }catch(e){
        console.log(e)
    }
})
