const db = require("../models");


module.exports = (app) => {
  
  //fetches all post from a specific user
  app.get("/api/posts/:user?", (req, res) => {

    if(req.params.user){
       db.posts.findAll({
      where: {
        user_id: req.params.user,
      },
    })
      .then((posts) => {
        res.json(posts);
      })
      .catch(function (err) {
        res.json(err);
      });
    }else{
      db.posts.findAll()
        .then((posts) => {
          res.json(posts);
        })
        .catch(function (err) {
          res.json(err);
        });
    }
   
  });

  //creates a new post in the database
  app.post("/api/post", (req, res) => {
    db.posts.create({
      user_id: req.body.user_id,
      post_content: req.body.post_content,
    })
      .then((post) => {
        res.json(post);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //updates a specific post
  app.put("/api/post/:id", (req, res) => {
    db.posts.update(
      {
        post_content: req.body.post_content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then((post) => {
        res.send(post);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //creates a vote in the database
  app.post("/api/vote", (req, res) => {
    db.votes.create({
      user_id: req.body.user_id,
      post_id: req.body.post_id,
      vote: req.body.vote,
    })
      .then((vote) => {
        res.json(vote);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //updates specific vote
  app.put("/api/vote/:id", (req, res) => {
    db.votes.update(
      {
        vote: req.body.vote,
      },
      {
        where: {
          user_id: req.body.user_id,
          post_id: req.body.post_id,
        },
      }
    )
      .then((vote) => {
        res.json(vote);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // fetches all comments from a particular post
  app.get("/api/comments/:user/:post", (req, res) => {
    db.comments.findAll({
      where: {
        user_id: req.params.user,
        post_id: req.params.post,
      },
    })
      .then((comments) => {
        res.json(comments);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //creates a comment in the database
  app.post("/api/comment/", (req, res) => {
    db.comments.create({
      user_id: req.body.user_id,
      post_id: req.body.post_id,
      comment_content: req.body.comment_content,
    })
      .then((comment) => {
        res.json(comment);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // creates user information into db -----------
  app.post("/api/signup/", (req, res) => {
    db.users.create({

      user_firstName: req.body.user_firstName,
      user_lastName: req.body.user_lastName,
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      user_birthday: req.body.user_birthday,
      user_bio: req.body.user_bio,
      user_password: req.body.user_password,

    })
    .then((result) => {
      res.json(result);
    })
    .catch(function (err) {
      res.json(err);
    })
  });

  // searches db to match 2 queries username & password --------
  app.get("/api/login/", (req, res) => {
    db.users.findOne({
      limit: 1,
      where: {
        user_name: req.params.user_name,
        user_password: req.params.user_password
      }

    })
    .then((result) => {
      res.json(result);
    })
    .catch(function (err) {
      res.json(err);
    })
  })


};
