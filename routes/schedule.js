const cron = require('node-cron');
const User = require('../models/User');

const startUsers = cron.schedule('*/1 * * * *', async () => {
	try {
	  console.log('here');
	  let docs = await User.find();
	  docs.forEach((doc) => { console.log(doc); });
	} catch(error) {
	  console.log(err);
	}
  });

  exports.startUsers = () => {
    startUsers.start();
  };