const bcrypt = require("bcrypt");
const db = require("../models");

module.exports = (app) => {
  //fetches all post from a specific user or all posts if user not specified
  app.get("/api/posts/:user?", (req, res) => {
    if (req.params.user) {
      db.posts
        .findAll({
          where: {
            user_id: req.params.user,
          },
        })
        .then((posts) => {
          res.json(posts);
        })
        .catch(function (err) {
          res.send(err);
        });
    } else {
      db.posts
        .findAll()
        .then((posts) => {
          res.json(posts);
        })
        .catch(function (err) {
          res.send(err);
        });
    }
  });

  //creates a new post in the database

  app.post("/api/post/:id", (req, res) => {
    db.posts.create({
      user_id: req.params.id,
      post_content: req.body.post_content,
    })
      .then((post) => {
        res.json(post);
      })
      .catch(function (err) {
        res.send(err);
      });
  });

  //updates a specific post
  app.put("/api/post/:id", (req, res) => {
    db.posts
      .update(
        {
          post_content: req.body.post_content,
        },
        {
          where: {
            post_id: req.params.id,
          },
        }
      )
      .then((post) => {
        res.status(200).end();
      })
      .catch(function (err) {
        res.send(err);
      });
  });

  //creates a vote in the database
  app.post("/api/vote", (req, res) => {
    db.votes
      .create({
        user_id: req.body.user_id,
        post_id: req.body.post_id,
        vote: req.body.vote,
      })
      .then((vote) => {
        res.json(vote);
      })
      .catch(function (err) {
        res.send(err);
      });
  });

  //updates specific vote
  app.put("/api/vote/:id", (req, res) => {
    db.votes
      .update(
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
        res.send(err);
      });
  });

  // fetches all comments from a particular post
  app.get("/api/comments/:post", (req, res) => {
    db.comments
      .findAll({
        where: {
          // removed user id as search criteria so I could load all comments per post CL
          // user_id: req.params.user,
          post_id: req.params.post,
        },
      })
      .then((comments) => {
        res.json(comments);
      })
      .catch(function (err) {
        res.send(err);
      });
  });

  //creates a comment in the database
  app.post("/api/comment/", (req, res) => {
    db.comments
      .create({
        user_id: req.body.user_id,
        post_id: req.body.post_id,
        comment_content: req.body.comment_content,
      })
      .then((comment) => {
        res.json(comment);
      })
      .catch(function (err) {
        res.send(err);
      });
  });

  app.put("/api/comment/:id", (req, res) => {
    db.comments
      .update(
        {
          comment_content: req.body.comment_content,
        },
        {
          where: {
            comment_id: req.params.id,
          },
        }
      )
      .then((comment) => {
        res.status(200).end();
      })
      .catch(function (err) {
        res.send(err);
      });
  });

  // creates user information into db -----------
  app.post("/api/signup/", (req, res) => {
    db.users
      .create({
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
        res.send(err);
      });
  });

  // searches db to match 2 queries username & password --------
  app.post("/api/login", (req, res) => {
    db.users
      .findOne({
        where: {
          user_name: req.body.user_name,
        },
      })
      .then(function (user) {
        if (!user) {
          res.status(400).send("Invalid Login!");
        } else {
          bcrypt.compare(req.body.user_password, user.user_password, function (
            err,
            result
          ) {
            if (result) {
              res.redirect("/");
            } else {
              res.status(400).send("Invalid Login!");
            }
          });
        }
      });
  });

  // views selected user_profile by id
  app.get("/api/user/:id", (req, res) => {
    db.users
      .findOne({
        limit: 1,
        where: {
          user_id: req.params.id,
        },
      })
      .then((result) => {
        res.json(result);
      })
      .catch(function (err) {
        res.send(err);
      });
  });

  // edit user profile info
  app.put("/api/user/:id", (req, res) => {
    db.users
      .update(
        {
          user_firstName: req.body.user_firstName,
          user_lastName: req.body.user_lastName,
          user_name: req.body.user_name,
          user_email: req.body.user_email,
          user_birthday: req.body.user_birthday,
          user_bio: req.body.user_bio,
          user_password: req.body.user_password,
        },
        {
          where: {
            user_id: req.params.id,
          },
        }
      )
      .then((result) => {
        res.json(result);
      })
      .catch(function (err) {
        res.send(err);
      });
  });
};
