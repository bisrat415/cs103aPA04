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
         date: new Date(),
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
      console.log("inside /transaction/edit/:objectId")
      await transactionItem.deleteOne({_id:req.params.objectId});
      res.redirect('/transaction')
});

module.exports = router;
