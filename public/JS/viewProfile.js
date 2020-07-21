$(document).ready(function() {
    console.log( "ready!" );

    let thisUser = localStorage.getItem('user_id')
    
    function renderProfile() {
        $.get('/api/user/' + thisUser, function(data) {

            let username = $('<div>').text(data.user_name)
            let name = $('<div>').text(data.user_firstName + data.user_lastName)
            let bio = $('<div>').text(data.user_bio)
            let bdayFormat = dayjs(data.user_birthday).add(1, 'day').format("MM-DD-YYYY")
            let bday = $('<div>').text(bdayFormat)
            $("#viewProfileContent").append(username, name, bio, bday)

            console.log(data)
        }) 
        
    }

    renderProfile()


    function renderPosts() {
        $.get('/api/posts/' + thisUser, function(data) {

            console.log(data)
        })
    }


});