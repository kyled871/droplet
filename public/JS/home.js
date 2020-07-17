$( document ).ready(function() {
    console.log( "ready!" );

    
    // global variables
    const postsContainer = $('#posts')
    let posts;
    let userName;
    let allComments = [];

    // Log in --------------------------------------------

    function renderLoginButton(){
        $('#loginOrLogoutDiv').empty()
        let loginBtn = $('<button>')
        loginBtn.attr('id', 'loginBtn')
        loginBtn.attr('type', 'button')
        loginBtn.addClass('btn btn-info')
        loginBtn.text('Log In')
        $('#loginOrLogoutDiv').append(loginBtn)
    }

    function renderLogoutButton(){
        $('#loginOrLogoutDiv').empty()
        let logoutBtn = $('<button>')
        logoutBtn.attr('id', 'logoutBtn')
        logoutBtn.attr('type', 'button')
        logoutBtn.addClass('btn btn-info')
        logoutBtn.text('Log Out')
        $('#loginOrLogoutDiv').append(logoutBtn)
    }

    if (!localStorage.getItem('user_id')){
        renderLoginButton()
        $('#loginBtn').click(function(){
            $('#loginModal').modal('show')
        })
    } else {
        renderLogoutButton()
        $('#logoutBtn').click(function(){
            localStorage.clear()
            location.reload()
        })
    }

    $('#loginModalBtn').click(function(){
        let userLoginInfo = {
            user_name: $('#loginModalUserName').val().trim(),
            user_password: $('#loginModalPassword').val().trim()
        }
        storeUser(userLoginInfo)
        $('#loginModal').modal('toggle')
        getPosts()
        renderLogoutButton()

    })

    $('#signupModalBtn').click(function(){
        let userSignupInfo = {
            user_name: $('#signupModalUserName').val().trim(),
            user_password: $('#signupModalPassword').val().trim()
        }
    })

    // Store user data to localstorage, needs to happen on login
    function storeUser(login) {
        console.log(login)
        $.post('/api/login', {
            user_name: login.user_name,
            user_password: login.user_password
        }, function(data) {
            console.log(data)
            if (data) {
                localStorage.setItem('user_id', data.user_id)
            }
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
        console.log(userId)
        $.post('api/post/' + userId, {
            post_content: $('#postModalBody').val()
        }, function(data){
            console.log(data);
            location.reload();
        })
    })

    $(document).on('click', 'button.edit', editPost);
    $('#editPostModalSubmit').click(function(){
        let id = $(this).attr('data-id')
        console.log($('#editPostModal').attr('data-id'))
        //if(localStorage.getItem('user_id')){
            let newPost = {
                user_id: "43cd3286-dbd6-4c3a-a3ce-bba6f227beee",
                // localStorage.getItem('user_id'),
                post_content: $('#editPostModalBody').val().trim(),
            }
            console.log(newPost)
            // let modalImage = $('#')
            $.ajax({
                url: '/api/post/' + $('#editPostModal').attr('data-id'),
                type: 'PUT',
                data: newPost,
                success: function(result) {
                    console.log(result)
                    location.reload() 
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
        newPostDroplet.addClass('rounded');
        
        // div contains the top section of the droplet
        let newDropletHeader = $('<div>');
        
        // bootstrap classes go here to style the top section of the droplet
        newDropletHeader.addClass('');
        
        // div contains the body/middle section of the droplet
        let newDropletBody = $('<div>');

        // content of the post
        newDropletBody.text(post.post_content);
        
        // bootstrap classes go here to style the body/middle section of the droplet
        newDropletBody.addClass('');
        
        // div contains the bottom section of the droplet
        let newDropletFooter = $('<div>');
        
        // bootstrap classes go here to style the bottom section of the droplet
        newDropletFooter.addClass('');

        // gets comments and adds them to newDropletFooter
        getComments(post.post_id).then(function(data){
            let commentArr =  [];
            for (let i = 0; i < data.length; i++){
                newDropletFooter.append(data[i].comment_content + '<br>')
            }

            // only the user can edit the post
            let editBtn = $('<button>');

            // add edit button icon html here
            editBtn.html('Edit');

            // store the post id to the edit button
            editBtn.attr('data-id', post.post_id);
            editBtn.attr('data-body', post.post_content)

            // bootstrap classes 
            editBtn.addClass('edit btn btn-info');
            
            // display time and date somewhere in small text
            let newDropletDateTime = $('<small>');

            // gets date/time from post data
            let createdDate = new Date(post.date_time);

            // format createdDate with moment
            // createdDate = moment(createdDate).format("MMMM Do YYYY, h:mm:ss a");

            newDropletDateTime.text(createdDate);


            function appendAll(){
                // append all data to positions within the newly created row
                console.log(localStorage.getItem('user_id'))
                console.log(post.user_id)
                if (localStorage.getItem('user_id') === post.user_id){
                    newDropletHeader.append(editBtn);
                }
                newDropletHeader.append(newDropletDateTime)
                newPostDroplet.append(newDropletHeader);
                newPostDroplet.append(newDropletBody);
                newPostDroplet.append(newDropletFooter);
                newPostDroplet.data('post', post);
            }
            if (post.user_id){
                getUserName(post.user_id).then(function(data){
                    if (data){
                        newDropletHeader.append(data.user_name);
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