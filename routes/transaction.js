/*
  transaction.js -- Router for the Transactions
*/
const express = require('express');
const router = express.Router();
const transactionItem = require('../models/transactionItem');
const methodOverride = require("method-override");

// override with POST having ?_method=PUT
router.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// middleware to make sure a user is logged in
isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// For displaying the list of transactions
router.get('/transaction/',
  isLoggedIn,
  async (req, res, next) => {
    const sortBy = req.query.sortBy;
    res.locals.sortBy = sortBy;
    transactionItem.find()
      .then((transactions) => {
        if (sortBy) {
          if (sortBy === "category") {
            transactions.sort((a, b) => {
            const categoryA = a.category.toLowerCase();
            const categoryB = b.category.toLowerCase();
            if (categoryA < categoryB) {
              return -1;
            }
             if (categoryA > categoryB) {
             return 1;
            }
              return 0;
            });
          } else if (sortBy === "amount") {
            transactions.sort((a, b) => {
              return a.amount - b.amount;
            });
          }
          else if (sortBy === "description") {
            transactions.sort((a, b) => {
              const descriptionA = a.description.toLowerCase();
              const descriptionB = b.description.toLowerCase();
              if (descriptionA < descriptionB) {
                return -1;
              }
              if (descriptionA > descriptionB) {
                return 1;
              }
              return 0;
            });
          }
          else if (sortBy === "date") {
            transactions.sort((a, b) => {
              if (a.date < b.date) {
                return -1;
              }
              if (a.date > b.date) {
                return 1;
              }
              return 0;
            });
          }
        }
        res.locals.things = transactions;
        res.render("transacList");
      })
      .catch((error) => {
        console.log(`Error fetching transaction by ID: ${error.message}`);
        next(error);
      });
      
});


// For creating a new transaction
router.post('/transaction',
  isLoggedIn,
  async (req, res, next) => {
      const transac = new transactionItem(
        {description:req.body.description,
         amount:req.body.amount,
         category:req.body.category,
         date:req.body.date,
         userId: req.user._id
        })
      await transac.save();
      res.redirect('/transaction')
});

router.get('/transaction/groupByCategory',
  isLoggedIn,
  async (req, res, next) => {
    res.locals.things = await transactionItem.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);
    res.render("groupByCategory");
});



// For deleting a transaction
router.get('/transaction/remove/:objectId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/remove/:objectId")
      await transactionItem.deleteOne({_id:req.params.objectId});
      res.redirect('/transaction')
});

// For editing a transaction
router.get('/transaction/:objectId/edit',
  isLoggedIn,
  async (req, res, next) => {
    let objectId = req.params.objectId;
    let transaction = await transactionItem.findById(objectId);
    res.render('edit', {transaction: transaction});
});

// For updating a transaction
router.put('/transaction/:objectId/update',
  isLoggedIn,
  async (req, res, next) => {
    let objectId = req.params.objectId;
    updatedTransaction = {
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date,
      userId: objectId,
    };
    await transactionItem.findByIdAndUpdate(objectId, {
      $set: updatedTransaction,
    });
    
    res.redirect("/transaction");
  }
);

module.exports = router;
