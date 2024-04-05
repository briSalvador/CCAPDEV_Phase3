document.addEventListener('DOMContentLoaded', async function(){
    try{
        const res = await fetch('/user/curr-user')
        const data = res.json()

        if(data.role == 'Visitor'){
            let e = document.getElementsByClassName('admin')
            e.style.display = 'None'
        }
    }catch(e){
        console.log(e)
    }
})