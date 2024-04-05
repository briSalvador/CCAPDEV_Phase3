document.addEventListener('DOMContentLoaded', function(){
    const edit = document.querySelector('.edit-profile-btn')

    edit.addEventListener('click', async function(e){
        window.location.href = '/edit-profile'
    })
})