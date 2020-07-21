$(document).ready(function() {
    console.log( "ready!" );

    let thisUser = localStorage.getItem('user_id');

    // set and style main content div
    let profileContent = $("#viewProfileContent");
    profileContent.addClass('');

    function renderProfile() {
        $.get('/api/user/' + thisUser, function(data) {
            // create and style username
            let username = $('<div>');
            username.addClass('');
            let usernameH = $('<h1>').text(data.user_name);
            usernameH.addClass('');
            username.append(usernameH)

            // create and style name
            let name = $('<div>');
            name.addClass('');
            let nameH = $('<h2>').text(data.user_firstName + ' ' + data.user_lastName);
            nameH.addClass('');
            name.append(nameH)

            // create and style user bio
            let bio = $('<div>');
            bio.addClass('');
            let bioP = $('<p>').text(data.user_bio);
            bioP.addClass('');
            bio.append(bioP)

            // create, format, and style user birthday
            let bdayFormat = dayjs(data.user_birthday).add(1, 'day').format("MM-DD-YYYY");
            let bday = $('<small>');
            bday.addClass('');
            let bdayP = $('<p>').text(bdayFormat);
            bdayP.addClass('');
            bday.append(bdayP)


            profileContent.append(username, name, bday, bio);
            renderPosts();

        });

        
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