module.exports = {
	zipObject: function (a, b) {
		let result = {};

		if (a.length !== b.length) {
			throw "object and value arrays must be equal length";
		}

		a.forEach((key, index) => result[key] = b[index]);
		
		return result;
	}
};