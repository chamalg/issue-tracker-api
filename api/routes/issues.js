const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");

const Issue = require("../models/issue");

router.get("/", (req, res, next) => {
  Issue.find()
    .select("name pricce _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/issues/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  const issue = new Issue({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  issue
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created issue successfully",
        createdIssue: {
          name: result.name,
          price: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/issues/" + result._id
          }
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      });
    });
});

router.get("/:issueId", (req, res, next) => {
  const issueId = req.params.issueId;
  Issue.findById(issueId)
    .exec()
    .then(doc => {
      console.log("From database ", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No valid entry found for provided id"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:issueId", (req, res, next) => {
  const id = req.params.issueId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Issue.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:issueId", (req, res, next) => {
  const id = req.params.issueId;
  Issue.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Issue is deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/issues",
          body: { name: String, price: "Number " }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
