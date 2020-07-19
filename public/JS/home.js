$( document ).ready(function() {
    
    // global variables
    const postsContainer = $('#posts')
    let posts;
    let userName;
    let allComments = [];
    let commentUserNames = [];

    // Log in --------------------------------------------

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
        signUpBtn.html('Sign Up')
        $('#createPorfileOrPostDiv').append(signUpBtn)
    }
    
    function renderCreatePostButton(){
        $('#createPorfileOrPostDiv').empty()
        let createPostBtn = $('<button>')
        createPostBtn.attr('type', 'button')
        createPostBtn.attr('id', 'createPostButton')
        createPostBtn.addClass('btn btn-info btn-block')
        createPostBtn.html('Create Post')
        $('#createPorfileOrPostDiv').append(createPostBtn)
    }

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
                $('#signupModal').modal('toggle')
                renderButtons()
                getPosts()
            }
        }).fail(function(){
            console.log('error')
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
                $('#loginModal').modal('toggle')
            }
        }).fail(function(){
            console.log('error')
        })
    }

    // End Log in --------------------------------------------

    // Create/edit post ---------------------------------------

    $('#createPostButton').on('click', createPost)
    
    function createPost(){
        let id = localStorage.getItem('user_id')
        $('#postModal').attr('data-user_id', id)
        $('#postModal').modal('show')
    }

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

    $(document).on('click', 'button.edit', editPost);
    $('#editPostModalSubmit').click(function(){
        let id = $(this).attr('data-id')
        //if(localStorage.getItem('user_id')){
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
        //}
    })

    function editPost(){
        let id = $(this).attr('data-id')
        let body = $(this).attr('data-body')
        $('#editPostModal').attr('data-id', id)
        //$('#editPostModal').attr('data-body', body)
        $('#editPostModalBody').html(body)
        $('#editPostModal').modal('show')
    }


    // End Create/edit post ------------------------------------------

    // Create/edit comments ------------------------------------------

    $(document).on('click', 'button.addComment', createComment)
    
    function createComment(data){
        let id = localStorage.getItem('user_id')
        $('#commentModal').attr('data-user_id', id)
        $('#commentModal').attr('data-post_id', data.target.attributes[0].value)
        $('#commentModal').modal('show')
    }

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

    $(document).on('click', 'button.editComment', editComment);

    function editComment(){
        let id = $(this).attr('data-id')
        let body = $(this).attr('data-body')
        $('#editCommentModal').attr('data-id', id)
        $('#editCommentModal').attr('data-body', body)
        $('#editCommentModalBody').html(body)
        $('#editCommentModal').modal('show')
    }

    $('#editCommentModalSubmit').click(function(){
        let id = $('#editCommentModal').attr('data-id')
        //if(localStorage.getItem('user_id')){
            let newComment = {
                comment_content: $('#editCommentModalBody').val().trim(),
            }
            $.ajax({
                url: '/api/comment/' + id,
                type: 'PUT',
                data: newComment,
                success: function(result) {
                    console.log(result)
                    $('#editCommentModal').modal('toggle')
                    getPosts(); 
                }
            })
        //}
    })

    // End create/edit comments --------------------------------------

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

    // Retrieve user_name from database related to user_id specified
    function getUserName(userId){
        return $.get('api/user/' + userId, function(data){
            if (data){
                userName = data.user_name;
            }
            return userName;
        })
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
        // div contains the whole post droplet
        let newPostDroplet = $('<div>');
        
        // bootstrap classes go here for styling the whole droplet
        newPostDroplet.addClass('card my-2');

        let newDropletCardBody = $('<div>')
        newDropletCardBody.addClass('card-body')
        newDropletCardBody.css('width: 18rem;')
        
        // div contains the top section of the droplet
        let newDropletHeader = $('<div>');
        
        // bootstrap classes go here to style the top section of the droplet
        newDropletHeader.addClass('card-title row');
        
        // div contains the body/middle section of the droplet
        let newDropletBody = $('<div>');

        // content of the post
        newDropletBody.text(post.post_content);
        
        // bootstrap classes go here to style the body/middle section of the droplet
        newDropletBody.addClass('card-text');
        
        // div contains the bottom section of the droplet
        let newDropletFooter = $('<div>');
        
        // bootstrap classes go here to style the bottom section of the droplet
        newDropletFooter.addClass('card-body mt-2');
        newDropletFooter.css('border-top', '1px solid black')

        // Add comment button, only shows up if logged in       
        let addComment = $('<button>')
        addComment.attr('data-post_id', post.post_id)
        addComment.attr('data-user_id', localStorage.getItem('user_id'))
        addComment.addClass('addComment btn btn-info my-2')
        addComment.text('Add Comment')

        // Edit comments
        let editCommentBtn = $('<button>')
        editCommentBtn.attr('data-post_id', post.post_id)
        editCommentBtn.attr('data-user_id', localStorage.getItem('user_id'))
        editCommentBtn.addClass('editComment btn mx-2')
        editCommentBtn.html('<img src="https://img.icons8.com/carbon-copy/20/000000/pencil.png"/>')

        // gets comments and adds them to newDropletFooter
        getComments(post.post_id).then(function(data){
            
            for (let i = 0; i < data.length; i++){
                
                // pushes user name associated with each comment into commentUserNames array
                getUserName(data[i].user_id).then(function(info){
                    commentUserNames.push(info.user_name + ' ')
                })
                
                if (data[i].user_id === localStorage.getItem('user_id')){
                    editCommentBtn.attr('data-id', data[i].comment_id)
                    let commentContent = data[i].comment_content
                    newDropletFooter.append(data[i].comment_content)

                    newDropletFooter.append(editCommentBtn)
                    newDropletFooter.append('<br>')

                } else {
                    newDropletFooter.append(data[i].comment_content + '<br>')
                }

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

            // add edit button icon html here
            deleteBtn.html('<img src="https://img.icons8.com/ios/20/000000/delete.png"/>');

            // store the post id to the edit button
            deleteBtn.attr('data-id', post.post_id);

            // bootstrap classes 
            deleteBtn.addClass('delete btn col-1');
            
            // display time and date somewhere in small text
            let newDropletDateTime = $('<small>');

            // gets date/time from post data
            let createdDate = new Date(post.createdAt);

            // format createdDate with moment
            createdDate = dayjs(createdDate).format("MMM D, YYYY h:mm A");
            
            newDropletDateTime.html('<br>' + createdDate);


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
                getUserName(post.user_id).then(function(data){
                    if (data){
                        let dropletUserName = $('<div>')
                        dropletUserName.addClass('font-weight-bold col-6')
                        dropletUserName.text(data.user_name)
                        newDropletHeader.append(dropletUserName);
                        appendAll(); 
                    } else {
                        appendAll()
                    }
                })
            } else {
                appendAll();
            }    
        })
        return newPostDroplet;
    }

    // End display all posts ----------------------------------------

}); // Close document ready function