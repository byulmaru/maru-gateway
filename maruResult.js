class MaruResult {
	/**
	 * Create a MaruResult object.
	 * @param {Number} [code] - HTTP status code to return.
	 * @param {Object} content - An object to return.
	 */
	constructor(code, content) {
		if(content === undefined) {
			content = code;
			code = 200;
		}
		this.content = content;
		this.code = code;
	}
	cookResult(res) {
		res.status(this.code).json(this.content || {});
	}
}

module.exports = MaruResult;