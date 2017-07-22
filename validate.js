const validator = require('validator');

module.exports = (value, rule) => {
	switch(rule.type) {
		case 'number':
			return /^\d+$/.test(value);
		case 'email':
			return validator.isEmail(value);
		case 'string':
			return validator.isLength(value, {min: rule.min, max: rule.max});
		case 'uuid':
			return validator.isUUID(value);
		default:
			console.warn(`Unknown type ${rule.type}`);
			return true;
	}
};