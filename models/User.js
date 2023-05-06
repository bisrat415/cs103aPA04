
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var userSchema = Schema( {
  username:String,
  passphrase: String,
  age:Number,
} );

module.exports = mongoose.model( 'UserGroup1', userSchema );
