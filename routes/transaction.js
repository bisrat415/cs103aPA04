/*
  transaction.js -- Router for the Transactions
*/
const express = require('express');
const router = express.Router();
const transactionItem = require('../models/transactionItem');


/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key
router.get('/transaction/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.things = await transactionItem.find({userId:req.user._id})
      res.render('transacList');
});


/* add the value in the body to the list associated to the key */
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

router.get('/transaction/remove/:objectId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /transaction/remove/:objectId")
      await transactionItem.deleteOne({_id:req.params.objectId});
      res.redirect('/transaction')
});

router.get('/transaction/edit/:objectId',
  isLoggedIn,
  async (req, res, next) => {
    let objectId = req.params.objectId;
    console.log(objectId);
    res.locals.transaction = await transactionItem.find({_id: objectId});
    res.render('edit');
    // transactionItem.findById(objectId)
    //   .then((transaction) => {
    //     res.render("edit", {
    //       transaction: transaction,
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(`Error fetching transaction by ID: ${error.message}`);
    //     next(error);
    //   });
});

router.put(
  "/transaction/update/:objectId",
  isLoggedIn,
  async (req, res, next) => {
    let objectId = req.params.id;
    updatedTransaction = {
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date,
    };
    transactionItem.findByIdAndUpdate(objectId, {
      $set: updatedTransaction,
    })
      .then((transaction) => {
        res.redirect("/transaction");
      });
    }
);

module.exports = router;
