$(document).ready(function() {

    let firstName;
    let lastName;
    let birthdayDate;
    let emailAddress;
    let userNameInput;
    let bioInput;

    // Global variables for edit link
    let editProfileLink = $('<a>').addClass('nav-link')
    editProfileLink.attr('href', '#')
    editProfileLink.attr('id', 'editProfileLink')
    editProfileLink.text('Edit Profile')

    // Global variables for delete profile link
    let deleteProfileLink = $('<a>').addClass('nav-link')
    deleteProfileLink.attr('href', '#')
    deleteProfileLink.attr('id', 'deleteProfileLink')
    deleteProfileLink.text('Delete Profile')

    let chosenUser;
    let pathArr = window.location.pathname.split('/');
    // console.log(pathArr[pathArr.length - 1])

    if (pathArr[pathArr.length - 1] === 'profile' || pathArr[pathArr.length - 1] === localStorage.getItem('user_id')){
        chosenUser = localStorage.getItem('user_id');
        renderEditProfileLink();
        renderDeleteProfileLink()

    } else {
        chosenUser = pathArr[pathArr.length - 1]
    }

    // set and style main content div
    let profileContent = $("#viewProfileContent");
    profileContent.addClass('mt-4');

    let postContent= $('#viewPostContent')
    postContent.addClass('mt-4')

    
    // Function to render edit link
    function renderEditProfileLink(){
        $('#editProfileLinkContainer').append(editProfileLink)
    }
    
    // Event handler for edit profile link
    $(document).on('click','#editProfileLink',function(){

        $('#signupModal').attr('data-id', chosenUser)
        $('#signupModalFirstName').val(firstName)
        $('#signupModalLastName').val(lastName)
        $('#signupModalBirthday').attr('data-placeholder', dayjs(birthdayDate).add(1, 'day').format('MM/DD/YYYY'))
        $('#signupModalEmail').val(emailAddress)
        $('#signupModalUserName').val(userNameInput)
        $('#signupModalBio').val(bioInput)
        $('#signupModal').modal('show')
        $(".modal").on('shown.bs.modal', function () {
            $("[data-modalfocus]", this).focus();
        });
        
    })

    // Function to render delete profile link
    function renderDeleteProfileLink(){
        $('#deleteProfileLinkContainer').append(deleteProfileLink)
    }
    
    // function handles DELETE user process
    function deleteUser(){
        console.log(localStorage.getItem('user_id'))
        $('#confirmDeleteModal').modal('show')
        $('#confirmDeleteSubmit').click(function(){
            $.ajax({
                method: 'DELETE',
                url: '/api/user/' + localStorage.getItem('user_id')
            }).then(function(){
                $('#confirmDeleteModal').modal('toggle')
                localStorage.clear()
                window.location.replace("/")
            })
        })
    }

    $(document).on('click', '#deleteProfileLink', function() {

        deleteUser()
        
    });

    
    $('#signupModalSubmit').click(function(){
        let updatedInfo = {
            user_firstName: $('#signupModalFirstName').val().trim(),
            user_lastName: $('#signupModalLastName').val().trim(),
            user_name: $('#signupModalUserName').val().trim(),
            user_email: $('#signupModalEmail').val().trim(),
            user_birthday: $('#signupModalBirthday').val().trim(),
            user_bio: $('#signupModalBio').val().trim()
        }
        $.ajax({
            url: '/api/user/' + chosenUser,
            type: 'PUT',
            data: updatedInfo,
            success: function(result) {
                $('#signupModal').modal('toggle')
                renderProfile()
            }
        }).fail(function(err){
            $('#signupError').text('Signup Failed')
            $('.closeSignup').click(function(){
                $('#signupError').text('')
            })
        })
        
    })


    function renderProfile() {
        $('#viewProfileContent').empty()
        $.get('/api/user/' + chosenUser, function(data) {

            firstName = data.user_firstName;
            lastName = data.user_lastName;
            birthdayDate = data.user_birthday;
            emailAddress = data.user_email;
            userNameInput = data.user_name;
            bioInput = data.user_bio


            // create and style name
            let name = $('<div>');
            name.addClass('');
            let nameH = $('<h1>').text(data.user_firstName + ' ' + data.user_lastName);
            nameH.addClass('');
            name.append(nameH);
            
            // create and style username
            let username = $('<div>');
            username.addClass('text-mute');
            let usernameH = $('<h3>').text(data.user_name);
            usernameH.addClass('');
            username.append(usernameH)

            // Header for username and name of user
            let cardHeader = $('<div>');
            cardHeader.addClass('card-header text-center text-white bg-dark');
            cardHeader.append(name);
            cardHeader.append(username);

            // create and style user bio
            let bioPic = $('<img src="https://img.icons8.com/windows/20/000000/journal.png"/>')
            bioPic.addClass('mr-2')
            let bio = $('<div>');
            bio.addClass('');
            let bioP = $('<li>').text(data.user_bio);
            bioP.prepend(bioPic)
            bioP.addClass('list-group-item');
            bio.append(bioP);
            
            // create, format, and style user birthday
            let bdayPic = $('<img src="https://img.icons8.com/pastel-glyph/20/000000/birthday.png"/>')
            bdayPic.addClass('mr-2')
            let bdayFormat = dayjs(data.user_birthday).add(1, 'day').format("MMM D, YYYY");
            let bday = $('<div>');
            bday.addClass('');
            let bdayP = $('<li>').text(bdayFormat);
            bdayP.prepend(bdayPic)
            bdayP.addClass('list-group-item');
            bday.append(bdayP);
            
            
            let groupItems = $('<ul>');
            groupItems.addClass('list-group list-group-flush')
            groupItems.append(bday)
            groupItems.append(bio)

            profileContent.append(cardHeader, bday, bio);

            renderPosts();

        });
        
    }
    
    renderProfile()
    
    function renderPosts() {
        $('#viewPostContent').empty()

        $.get('/api/posts/' + chosenUser, function(data) {


            let postSection = $('<div>');
            postSection.addClass('card-header text-center text-white bg-dark');
            let postSectionH = $('<h2>').text('Posts: ');
            postSectionH.addClass('mb-3');
            postSection.append(postSectionH);

            for (i = 0; i < data.length; i++) {

                let posts = $('<div>');
                let postsP = $('<li>').text(data[i].post_content);
                postsP.addClass('<list-group-item>');
                postsP.css('list-style', 'none')
                posts.append(postsP)

                // display time and date somewhere in small text
                let newPostDateTime = $('<small>');

                // gets date/time from post data
                let PostDate = new Date(data[i].createdAt);

                // format createdDate with moment
                let formattedPostDate = dayjs(PostDate).format("MMM D, YYYY h:mm A");

                newPostDateTime.html('On ' + formattedPostDate + ':');
                
                posts.prepend(newPostDateTime)

                
                $(postSection).append(posts);
                
            }
            if (data.length){
                $('#viewPostContent').append(postSection);
            } else {
                $('#viewPostContent').hide()
            }

        })
        
    }

});