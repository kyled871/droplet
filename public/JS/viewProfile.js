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

        });

        renderPosts()
        
    }
    
    renderProfile()
    
    
    function renderPosts() {
        $.get('/api/posts/' + thisUser, function(data) {
            
            let postSection = $('<div>')
            postSection.text('Posts: ')
            postSection.attr('id', 'postSection')
            $('#viewProfileContent').append(postSection)
            postSection.append('<br>')

            for (i = 0; i < data.length; i++) {

                let posts = $('<div>').text(data[i].post_content)
                $('#postSection').append(posts)
                renderComments(data[i].post_id)


            }

        })
    }

    function renderComments(postId) {
        $.get('/api/comments/' + postId, function(data) {

            for (i = 0; i < data.length; i++) {

                let comments = $('<div>').text(data[i].comment_content)
                $('#postSection').append(comments)

            }
            
        })
        
    }

});