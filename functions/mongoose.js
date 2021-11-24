const mongoose = require('mongoose');
const ascii = require("ascii-table");

module.exports = (client) => {
		const dbOptions = { 
			useNewUrlParser: true,
			autoIndex: false,
			connectTimeoutMS: 10000,
			family: 4,
            useUnifiedTopology: true
		};
		var table = new ascii('Mongoose connection status!');

		mongoose.connect(process.env.mongoURI, dbOptions, (err) => {
			if (err) {
				table.addRow('Status', 'Failed');
				table.addRow('Error', err);
				console.log(table.toString());
				return process.exit(1);
			}
			table.addRow('Mongoose connection opened.');
			console.log(table.toString());
		});

		mongoose.Promise = global.Promise;

		mongoose.connection.on('err', err => {
			table.addRow('Mongoose connection error: ' + err + '.');
			console.log(table.toString());
		});
		
		mongoose.connection.on('disconnected', () => {
			table.addRow('Mongoose connection disconnected.');
			console.log(table.toString());
		});
};