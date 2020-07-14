$( document ).ready(function() {
    console.log( "ready!" );

    // global variables
    const postsContainer = $('#posts')
    let posts;

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
        
        // only the user can edit the post
        let editBtn = $('<button>');

        // add edit button icon html here
        editBtn.html('');

        // store the post id to the edit button
        editBtn.attr('data-id', post.id);

        // bootstrap classes 
        editBtn.addClass('');
        
        // display time and date somewhere in small text
        let newDropletDateTime = $('<small>');

        let createdDate = new Date(post.date_time);
        // createdDate = moment(createdDate).format("MMMM Do YYYY, h:mm:ss a");

        newDropletDateTime.text(createdDate);

        newDropletHeader.append(editBtn);
        newPostDroplet.append(newDropletHeader);
        newPostDroplet.append(newDropletBody);
        newPostDroplet.append(newDropletFooter);
        newPostDroplet.data('post', post);
        return newPostDroplet;
    }

});