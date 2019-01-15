const _ = require('lodash');
const { dialogflow, Suggestions } = require('actions-on-google');


const app = dialogflow({ debug: true });
const intentList = [

];


exports.customEntry = (req, res, next) => {

  return next();
};

exports.googleDialogflow = app;