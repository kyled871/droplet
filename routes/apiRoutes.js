const db = requires("../models");

module.exports = (app) => {
  //fetches all post from a specific user
  app.get("/api/posts/:user", (req, res) => {
    db.Posts.findAll({
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
  });

  //creates a new post in the database
  app.post("/api/post", (req, res) => {
    db.Posts.create({
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
    db.Posts.update(
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
    db.Votes.create({
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
    db.Votes.update(
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
    db.Comments.findAll({
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
    db.Comments.create({
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
};
