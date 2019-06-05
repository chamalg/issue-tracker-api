const mongoose = require("mongoose");
const User = require("../models/user");
const Issue = require("../models/issue");

exports.getAllUsers = (req, res, next) => {
  User.find()
    .select("username password issue age _id")
    .populate("issue", "name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        users: docs.map(doc => {
          return {
            _id: doc._id,
            username: doc.username,
            password: doc.password,
            issue: doc.issue,
            age: doc.age,
            request: {
              type: "GET",
              url: "http://localhost:3000/users/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.saveUser = (req, res, next) => {
  Issue.findById(req.body.issueId)
    .then(issue => {
      if (!issue) {
        return res.status(404).json({
          message: "Issue nnot found"
        });
      }

      const user = new User({
        _id: mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password,
        issue: req.body.issueId,
        age: req.body.age
      });

      return user.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "User stored",
        createdUser: {
          _id: result._id,
          username: result.username
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/users/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .populate("issue")
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      res.status(200).json({
        user: user,
        request: {
          type: "GET",
          url: "http://localhost:3000/users/" + user._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.deleteUser = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      result.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
