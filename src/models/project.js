/*
 * Defines the model for a Project
 */
var restful = require('node-restful');
var mongoose = restful.mongoose;

//Defines the schema for a User
var projectSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false
	},
	funds: {
		raised: {
			type: Number,
			required: true
		},
		goal: {
			type: Number,
			required: true
		}
	}
	category: {
		type: Array,
		default: []
	},
	location: {
		type: Array,
		default: []
	},
	date: {
		dateObj: {
			type: Date,
			default: date
		},
		parsedDate: {
			type: String
		}	
	},
	rating: {
		likes: {
			type: Number,
			default: 0
		},
		dislikes: {
			type: Number,
			default: 0
		}
	}
}, {
	versionKey: false
});

module.exports = restful.model('Projects', projectSchema);