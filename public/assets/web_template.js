const web = document.querySelector('.template')
web.innerHTML = `<style>
@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark&family=Palanquin:wght@100&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Assistant&display=swap');

*{
    margin: 0;
}

:root{
    font-family: 'Palanquin Dark', sans-serif;
    font-size: 18px;
    --grey: #D9D9D9;
    --yellow: #FFECBB;
}

.design{
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
}

.design-top{
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-between;
}

#t1{
    margin-top: -150px;
    margin-left: -300px;
    clip-path: polygon(100% 100%, 70% 0, 0 46%);
}

.triangle{
    opacity: 50%;
    width: 460px;
    height: 350px;
    background-color: var(--grey);
}

.circle{
    opacity: 50%;
    width: 272px;
    height: 272px;
    background-color: var(--yellow);
    clip-path: circle();
}

#c1{
    margin-top: -87px;
    margin-right: -150px;
}

.design-bottom{
    position: fixed;
    margin-top: 480px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

#c2{
    margin-left: -100px;
}

#t2{
    margin-top: 30px;
    margin-right: -130px;
    clip-path: polygon(27% 100%, 100% 80%, 51% 0);
}

</style>

<div class="template">
<div class="design-top">
    <div id="t1" class="triangle">
    </div>
    <div id="c1" class="circle">
    </div>
</div>

<div class="design-bottom">
    <div id="c2" class="circle">
    </div>
    <div id="t2" class="triangle">
    </div>
</div>
</div>`

const nav = document.querySelector('.navbar')
nav.innerHTML = `<style>
@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark&family=Palanquin:wght@100&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Assistant&display=swap');

*{
    margin-top: 0;
    margin-left: 0;
    padding: 0;
}

:root{
    font-family: 'Palanquin Dark', sans-serif;
    font-size: 18px;
}

a{
    text-decoration: none;

}

.webname{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 70px;
}

.navbar{
    position: fixed;
    background: #1A1A1A;
    width: 100%;
}
.navdiv{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
}
.logo{
    font-size: 25px;
    font-weight: bold;
    font-family: 'Palanquin', sans-serif;
    color: white;
    margin-left: 25px;
}
li{
    list-style: none; 
    display: inline-block;
}
li a{
    color: white; 
    font-family: 'Palanquin Dark', sans-serif;
    font-size: 18px;
    margin-right: 48px;
}

li a:hover{
    color: rgb(174, 174, 174);
}

.v{
    font-size: 13px;
}

.navtext{
    display: flex;
    align-items: center;
    margin: 0;
}

ul{
    margin: 0;
}

.nav{
    position: sticky;
}

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    border-radius: 8px;
    display: none;
    position: absolute;
    background-color:  #1A1A1A;
    opacity: 80%;
    width: 120px;
    height: 150px;
    overflow: auto;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}

.dropdown-content a{
    color: white;
    padding: 12px 12px;
    text-decoration: none;
    display: block;
}

button{
    background-color: rgba(0, 0, 0, 0);
}

.dropdown-content a:hover {background-color: #ddd;}

.dropdown:hover .dropdown-content {display: block;}

.dropdown-content > a{
    font-size: 16px;
    margin-right: 0;
}

#profile{
    height: auto;
    margin-left: -30px;
}

#short_drop{
    height: auto;
    margin-left: -15px;
}


/* width */
::-webkit-scrollbar {
    width: 2px;
    opacity: 50%;
}

/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}

</style>

<nav class="nav">
<div class="navdiv">
    <div class="logo">WEBSITENAME</div>
    <ul>
        <li><a href="../Homepage/homepage.html">Home</a></li>
        <li><div class="dropdown">
            <a href="#" class="dropbtn">Reserve Lab</a>
            <div class="dropdown-content">
                <a href="../View Slots/view_slot.html">View Slots</a>
                <a href="../Reserve Lab/reserve.html">Reserve Lab</a>
                <a href="../Reserve For Page/reservefor.html">Reserve for Student</a>
                <a href="../Remove Page/removefor.html">Remove Reservation</a>
                <a href="../Edit slot/Edit.html">Edit/See Reservations</a>
            </div>
        </div></li>
        <li><div class="dropdown">
            <a href="#" class="dropbtn">Search</a>
            <div id="short_drop" class="dropdown-content">
                <a href="../Search/search.html">Search Slots</a>
                <a href="../Search Users/search_user.html">Search Users</a>
            </div>
        </div></li>
        <li><a href="../Register page/RegisterPage.html">Register</a></li>
        <li><div class="dropdown">
            <a href="#" class="dropbtn">Profile</a>
            <div id="profile" class="dropdown-content">
                <a href="../Login page/LoginPage.html">Log out</a>
                <a href="../Profile/index.html">View Profile</a>
            </div>
        </div></li>
    </ul>
</div>
</nav>
`