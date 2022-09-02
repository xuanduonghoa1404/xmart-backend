const cron = require('node-cron');
const Shop = require('../models/Shop');
const nodemailer = require('nodemailer');

// e-mail message options
let mailOptions = {
	from: 'alexander.becker@ethereal.email',
	to: 'xuanduonghoa1404@gmail.com',
	subject: 'Email from Node-App: A Test Message!',
	// text: "Hello world text?", // plain text body
    html: "<b>Hello world HTML?</b>", // html body
};

// e-mail transport configuration
// let transporter = nodemailer.createTransport({
// 	service: 'gmail',
// 	auth: {
// 	  user: '<FROM_EMAIL_ADDRESS>',
// 	  pass: '<FROM_EMAIL_PASSWORD>'
// 	}
// });
const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: 'alexander.becker@ethereal.email',
		pass: '8KEDNpy4aT8NtnkVZD'
	}
});
// cron.schedule('* * * * *', () => {
// 	// Send e-mail
// 	transporter.sendMail(mailOptions, function(error, info){
// 		  if (error) {
// 			console.log(error);
// 		  } else {
// 			console.log('Email sent: ' + info.response);
// 		  }
// 	  });
// 	});
let timeSchedule = '0 1 0 ? * *';
const defaultCronJob = cron.schedule('0 */2 * * * *', async () => {
	try {
	let shops = await Shop.find();
	let shop = shops[0];
	let schedule = shop.schedule;
	schedule = '0 30 23 * * *';
	// timeSchedule = schedule;
	// startJob.start();
	} catch (error) {
		console.log(error);
	}
})

const startJob = cron.schedule(timeSchedule, async () => {
	try {
		console.log('here');
		let shops = await Shop.find();
		let shop = shops[0];
		let schedule = shop.schedule;
		schedule = '0 0 23 ? * *';
		mailOptions.html = shop.templateEmail
		//   shops.forEach((doc) => { console.log(doc); });
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				// console.log('Email sent: ' + info.response);
				console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
			}
		});
	} catch (error) {
		console.log(err);
	}
});

exports.defaultCronJob = () => {
	defaultCronJob.start();
};