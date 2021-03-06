$( document ).ready(function() {
    
    // global variables
    const postsContainer = $('#posts')
    let posts;
    let userName;
    let allComments = [];
    let commentUserNames = [];

    // Log in --------------------------------------------

    // Buttons dynamically rendered depending on user state
    
    function renderLoginButton(){
        $('#loginOrLogoutDiv').empty()
        let loginBtn = $('<button>')
        loginBtn.attr('id', 'loginBtn')
        loginBtn.attr('type', 'button')
        loginBtn.addClass('btn btn-info btn-block')
        loginBtn.text('Login')
        $('#loginOrLogoutDiv').append(loginBtn)
    }

    function renderLogoutButton(){
        $('#loginOrLogoutDiv').empty()
        let logoutBtn = $('<button>')
        logoutBtn.attr('id', 'logoutBtn')
        logoutBtn.attr('type', 'button')
        logoutBtn.addClass('btn btn-danger btn-block')
        logoutBtn.html('Log Out <img src="https://img.icons8.com/ios-filled/15/000000/logout-rounded.png"/>')
        $('#loginOrLogoutDiv').append(logoutBtn)
    }

    function renderSignUpButton(){
        $('#createPorfileOrPostDiv').empty()
        let signUpBtn = $('<button>')
        signUpBtn.attr('type', 'button')
        signUpBtn.attr('id', 'signUpButton')
        signUpBtn.addClass('btn btn-info btn-block')
        signUpBtn.text('Sign Up')
        $('#createPorfileOrPostDiv').append(signUpBtn)
    }
    
    function renderCreatePostButton(){
        $('#createPorfileOrPostDiv').empty()
        let createPostBtn = $('<button>')
        createPostBtn.attr('type', 'button')
        createPostBtn.attr('id', 'createPostButton')
        createPostBtn.addClass('btn btn-info btn-block')
        createPostBtn.text('Create Post')
        $('#createPorfileOrPostDiv').append(createPostBtn)
    }
    
    // Handlers for dynamically loaded buttons 

    $(document).on('click', '#loginBtn', function(){
        $('#loginModal').modal('show')
    })

    $(document).on('click', '#signUpButton', function(){
        $('#signupModal').modal('show')
    })
    $(document).on('click', '#logoutBtn', function(){
        localStorage.clear()
        renderButtons()
        getPosts()
        showMyProfile()
    })

    // Loads button to page depending on whether user is sign in or not
    function renderButtons(){
        if (!localStorage.getItem('user_id')){
            renderLoginButton()
            renderSignUpButton()
            
        } else {
            renderCreatePostButton()
            renderLogoutButton()
        }
    }

    renderButtons()

    $('#loginModalBtn').click(function(){
        let userLoginInfo = {
            user_name: $('#loginModalUserName').val().trim(),
            user_password: $('#loginModalPassword').val().trim()
        }
        storeUser(userLoginInfo)
    })

    $('#signupModalSubmit').click(function(){
        let userSignupInfo = {
            user_firstName: $('#signupModalFirstName').val().trim(),
            user_lastName: $('#signupModalLastName').val().trim(),
            user_name: $('#signupModalUserName').val().trim(),
            user_password: $('#signupModalPassword').val().trim(),
            user_email: $('#signupModalEmail').val().trim(),
            user_birthday: $('#signupModalBirthday').val().trim(),
            user_bio: $('#signupModalBio').val().trim()
        }

        $.post('/api/signup/', userSignupInfo, function(user) {
            if(user){
                storeUser({
                user_password: userSignupInfo.user_password,
                user_name: userSignupInfo.user_name
                })                  
            }
            
        }).then(function(data){
            if (!data.errors){
                $('#signupModal').modal('toggle')
                renderButtons()
                getPosts()
            } else {
                data.errors.forEach(function(error) {
                    switch (error.path){
                        case 'user_firstName':
                            $('#signupError').text('Invalid First Name')
                        break;
                        
                        case 'user_lastName':
                            $('#signupError').text('Invalid Last Name')
                        break;

                        case 'user_birthday':
                            $('#signupError').text('Invalid Birthday')
                        break;
                        
                        case 'user_password':
                            $('#signupError').text('Invalid Password')
                        break;
                        
                        case 'user_email':
                            $('#signupError').text('Invalid Email')
                        break;                            

                        case 'user_name':
                            $('#signupError').text('Invalid Username')
                        break;
                    }
                })
            }
        }).fail(function(error){
            $('#signupError').text('Invalid Password')
            $('.closeSignup').click(function(){
                $('#signupError').text('')
            })
        })
    })

    // Store user data to localstorage, needs to happen on login
    function storeUser(login) {
        $.post('/api/login', {
            user_name: login.user_name,
            user_password: login.user_password
        }, function(data) {
            if (data) {
                localStorage.setItem('user_id', data.user_id)
                location.reload()
            } 
        }).fail(function(error){
            $('#loginError').text(error.responseText)
            $('.closeLogin').click(function(){
                $('#loginError').text('')
            })
        })
    }
    
    // allow logged in user to see "show profile" link on navbar
    function showMyProfile() {
        if (localStorage.getItem('user_id')) {
            $('#myProfileLink').show()

        } else {
            $('#myProfileLink').hide()
        }
    }
    
    showMyProfile()

    // End Log in ---------------------------------------------

    // Create/edit post ---------------------------------------

    // this will autofocus the first textarea in the modals when a user
    // clicks on them
    $(".modal").on('shown.bs.modal', function () {
        $("[data-modalfocus]", this).focus();
    });

    // event handler for CREATE post button
    $('#createPostButton').on('click', createPost)
    
    // function to handle CREATE post function
    function createPost(){
        let id = localStorage.getItem('user_id')
        $('#postModal').attr('data-user_id', id)
        $('#postModal').modal('show')
    }

    // event handler for post modal SUBMIT button
    $('#postModalSubmit').click(function(){
        let userId = $('#postModal').attr('data-user_id')
        $.post('api/post/' + userId, {
            post_content: $('#postModalBody').val()
        }, function(data){
            //location.reload();
            if (data){
                getPosts();
                $('#postModal').modal('toggle')
                $('#postModalBody').val('')
            }
        })
    })

    // event handler for EDIT post button
    $(document).on('click', 'button.edit', editPost);
    $('#editPostModalSubmit').click(function(){
        let id = $(this).attr('data-id')
        let newPost = {
            user_id: localStorage.getItem('user_id'),
            post_content: $('#editPostModalBody').val().trim(),
        }
        $.ajax({
            url: '/api/post/' + $('#editPostModal').attr('data-id'),
            type: 'PUT',
            data: newPost,
            success: function(result) {
                $('#editPostModal').modal('toggle')
                getPosts(); 
            }
        })
    })

    // function to handle the post EDIT
    function editPost(){
        let id = $(this).attr('data-id')
        let body = $(this).attr('data-body')
        $('#editPostModal').attr('data-id', id)
        //$('#editPostModal').attr('data-body', body)
        $('#editPostModalBody').text(body)
        $('#editPostModal').modal('show')
    }

    // End Create/edit post ------------------------------------------

    // Create/edit comments ------------------------------------------

    // event handler for CREATE comment button 
    $(document).on('click', 'button.addComment', createComment)
    
    // function handles CREATE comment process
    function createComment(data){
        let id = localStorage.getItem('user_id')
        $('#commentModal').attr('data-user_id', id)
        $('#commentModal').attr('data-post_id', data.target.attributes[0].value)
        $('#commentModal').modal('show')
    }

    // event handler for create comment modal SUBMIT button
    $('#commentModalSubmit').click(function(){
        let userId = $('#commentModal').attr('data-user_id')
        let postId = $('#commentModal').attr('data-post_id')
        $.post('api/comment/', {
            user_id: userId,
            post_id: postId,
            comment_content: $('#commentModalBody').val().trim()        
        }, function(data){
            if (data){
                $('#commentModal').modal('toggle')
                getPosts();
                $('#commentModalBody').val('')
            }
        })
    })

    // event handler for EDIT comment button
    $(document).on('click', 'button.editComment', editComment);

    // function handles EDIT comment process
    function editComment(){
        let id = $(this).attr('data-id')
        let body = $(this).attr('data-content')
        $('#editCommentModal').attr('data-id', id)
        $('#editCommentModal').attr('data-body', body)
        $('#editCommentModalBody').html(body)
        $('#editCommentModal').modal('show')
    }

    // event handler for edit comment modal SUBMIT button
    $('#editCommentModalSubmit').click(function(){
        let id = $('#editCommentModal').attr('data-id')
        let newComment = {
            comment_content: $('#editCommentModalBody').val().trim()
        }
        $.ajax({
            url: '/api/comment/' + id,
            type: 'PUT',
            data: newComment,
            success: function(result) {
                $('#editCommentModal').modal('toggle')
                getPosts(); 
            }
        })
    })

    // End create/edit comments --------------------------------------

    // Delete post/comment/user --------------------------------------
    
    // event handler for DELETE post button
    $(document).on('click', 'button.deletePost', deletePost);

    // function handles DELETE post process
    function deletePost(){
        let currentPost = $(this).attr('data-id')
        $('#confirmDeleteModal').attr('data-id', currentPost)
        $('#confirmDeleteModal').modal('show')
        $('#confirmDeleteSubmit').click(function(){
            $.ajax({
                method: 'DELETE',
                url: '/api/post/' + currentPost
            }).then(function(){
                $('#confirmDeleteModal').modal('toggle')
                getPosts()
            })
        })
    }
    
    $(document).on('click', 'button.deleteComment', deleteComment);

    // function handles DELETE post process
    function deleteComment(){
        let currentComment = $(this).attr('data-id')
        $('#confirmDeleteModal').attr('data-id', currentComment)
        $('#confirmDeleteModal').modal('show')
        $('#confirmDeleteSubmit').click(function(){
            $.ajax({
                method: 'DELETE',
                url: '/api/comment/' + currentComment
            }).then(function(){
                $('#confirmDeleteModal').modal('toggle')
                getPosts()
            })
        })
    }

    // End delete post/comment/user --------------------------------------

    // Display all posts ---------------------------------------------

    // get the post data from the posts table of the droplet database
    function getPosts(){
        $.get('/api/posts', function(data){
            posts = data;
            if (!posts || !posts.length){
                emptyDisplay();
            } else {
                initializeRows();
            }
        })
    }

    // if there are no posts, message to user displays
    function emptyDisplay(){
        postsContainer.empty();
        let messageToUser = $('<h2>');
        messageToUser.addClass('text-center');
        messageToUser.html('There are no posts to display!')
        postsContainer.append(messageToUser)
    }

    // call the getPosts function to either show empty display or initialize rows
    getPosts(); 
    
    // initializes rows to be created
    function initializeRows(){
        postsContainer.empty();
        let allPosts = [];
        for (let i = 0; i < posts.length; i++){
            allPosts.push(createNewRow(posts[i]));
        }
        postsContainer.append(allPosts)
    }

    // Retrieve comments from database related to single post_id specified
    function getComments(postId){ 
        return $.get('/api/comments/' + postId, function(data){
            for (let i = 0; i < data.length; i++){
                allComments.push(data[i])
            }
            return allComments
        })
    }

    // create the rows to populate postsContainer
    function createNewRow(post){

        // div contains the whole post droplet plus bootstrap classes
        let newPostDroplet = $('<div>');
        newPostDroplet.addClass('card mb-4');
        let newDropletCardBody = $('<div>')
        newDropletCardBody.addClass('card-body')
        
        // div contains the top section of the droplet plus bootstrap classes
        let newDropletHeader = $('<div>');
        newDropletHeader.addClass('card-title row');
        
        // div contains the body/middle section of the droplet plus classes
        let newDropletBody = $('<div>');
        let postContentH = $('<h4>')
        postContentH.text(post.post_content)
        newDropletBody.append(postContentH);
        newDropletBody.addClass('card-text border-bottom border-left p-2');
        
        // div contains the bottom section of the droplet plus classes
        let newDropletFooter = $('<div>');
        newDropletFooter.addClass('card-body');

        // Add comment button, only shows up if logged in       
        let addComment = $('<button>')
        addComment.attr('data-post_id', post.post_id)
        addComment.attr('data-user_id', localStorage.getItem('user_id'))
        addComment.addClass('addComment btn btn-info my-2')
        addComment.text('Add Comment')

        // gets comments and adds them to newDropletFooter
        getComments(post.post_id).then(function(data){
            for (let i = 0; i < data.length; i++){
                // Edit comments
                let editCommentBtn = $('<button>')
                editCommentBtn.attr('data-post_id', post.post_id)
                editCommentBtn.attr('data-user_id', localStorage.getItem('user_id'))
                editCommentBtn.addClass('editComment btn mx-2')
                editCommentBtn.html('<img src="https://img.icons8.com/carbon-copy/20/000000/pencil.png"/>')
                editCommentBtn.css('padding', '0')

                // Delete comments
                let deleteCommentBtn = $('<button>')
                deleteCommentBtn.attr('data-post_id', post.post_id)
                deleteCommentBtn.attr('data-user_id', localStorage.getItem('user_id'))
                deleteCommentBtn.addClass('deleteComment btn mx-2')
                deleteCommentBtn.html('<img src="https://img.icons8.com/ios/20/000000/delete.png"/>')
                deleteCommentBtn.css('padding', '0')

                // comment username and content
                let commentDiv = $('<div>')
                commentDiv.addClass('my-2 border')
                let usernameDiv = $('<div>')
                usernameDiv.addClass('m-2 font-weight-bold')
                let commentContentDiv = $('<div>')
                commentContentDiv.addClass('m-2')
                editCommentBtn.attr('data-id', data[i].comment_id)
                editCommentBtn.attr('data-content', data[i].comment_content)
                deleteCommentBtn.attr('data-id', data[i].comment_id)

                // append comment to footer
                let usernameA = $('<a>')
                usernameA.attr('href', '/profile/' + data[i].user_id)
                usernameA.append(data[i].user.user_name)
                usernameDiv.append(usernameA);
                commentDiv.append(usernameDiv);
                commentContentDiv.text(data[i].comment_content)
                commentDiv.append(commentContentDiv)
                if (data[i].user_id === localStorage.getItem('user_id')){
                    usernameDiv.append(editCommentBtn)
                }
                if (data[i].user_id === localStorage.getItem('user_id') || post.user_id === localStorage.getItem('user_id')){
                    usernameDiv.append(deleteCommentBtn)
                }
                
                newDropletFooter.append(commentDiv)

                // date and time that a comment was made
                let newCommentDateTime = $('<small>');
                let commentDate = new Date(data[i].createdAt);
                let formattedCommentDate = dayjs(commentDate).format("MMM D, YYYY h:mm A");
                newCommentDateTime.html('<br>' + formattedCommentDate);
                commentContentDiv.append(newCommentDateTime)
            }

            // only the user can edit the post
            let editBtn = $('<button>');

            // add edit button icon html here
            editBtn.html('<img src="https://img.icons8.com/carbon-copy/20/000000/pencil.png"/>');

            // store the post id to the edit button
            editBtn.attr('data-id', post.post_id);
            editBtn.attr('data-body', post.post_content)

            // bootstrap classes 
            editBtn.addClass('edit btn col-1 offset-sm-2 offset-md-3 offset-lg-4');
            
            // only the user can delete the post
            let deleteBtn = $('<button>');

            // add delete button icon html here
            deleteBtn.html('<img src="https://img.icons8.com/ios/20/000000/delete.png"/>');

            // store the post id to the delete button
            deleteBtn.attr('data-id', post.post_id);

            // bootstrap classes 
            deleteBtn.addClass('deletePost btn col-1');
            
            // display time and date somewhere in small text
            let newDropletDateTime = $('<small>');
            // gets date/time from post data
            let createdDate = new Date(post.createdAt);

            // format createdDate with moment
            createdDate = dayjs(createdDate).format("MMM D, YYYY h:mm A");
            
            newDropletDateTime.html(createdDate);


            function appendAll(){
                
                // append all data to positions within the newly created row
                if (localStorage.getItem('user_id') === post.user_id){
                    newDropletHeader.append(editBtn);
                    newDropletHeader.append(deleteBtn);
                }
                if (localStorage.getItem('user_id')){
                    newDropletFooter.append(addComment)
                }
                newDropletBody.append(newDropletDateTime)
                newDropletCardBody.append(newDropletHeader);
                newDropletCardBody.append(newDropletBody);
                newDropletCardBody.append(newDropletFooter);
                newPostDroplet.append(newDropletCardBody)
                newPostDroplet.data('post', post);
            }
            
            if (post.user_id){
                let dropletUserName = $('<div>')
                dropletUserName.addClass('font-weight-bold col-6')
                let dropletUserNameA = $('<a>')
                dropletUserNameA.attr('href', '/profile/' + post.user_id)
                dropletUserNameA.text(post.user.user_name)
                dropletUserName.append(dropletUserNameA)
                newDropletHeader.append(dropletUserName);
                appendAll();
            } else {
                let dropletUserName = $('<div>')
                dropletUserName.addClass('font-weight-bold col-6')
                dropletUserName.text('Deleted')
                newDropletHeader.append(dropletUserName);
                appendAll();
            }    
        })
        return newPostDroplet;
    }
    // End display all posts ----------------------------------------
}); // Close document ready function