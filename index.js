const express = require('express');
const bodyParser = require('body-parser');
const MaruResult = require('./maruResult');
const validate = require('./validate');

module.exports = (settings) => {
	const app = express();
	let functions = {};

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	return {
		func(name, pm) {
			functions[name] = pm;
		},
		start(port) {
			for(let f in settings.path) {
				if(settings.path.hasOwnProperty(f)) {
					for(let m in settings.path[f]) {
						if(settings.path[f].hasOwnProperty(m)) {
							const $this = settings.path[f][m];
							let requestObject = {};
							let worker = (req, res) => {
								if($this.hasOwnProperty('requests')) {
									for(let n in $this.requests) {
										if($this.requests.hasOwnProperty(n)) {
											let value;
											const sourceName = $this.requests[n].name || n;
											switch($this.requests[n].source) {
												case 'query':
													value = req.query[sourceName];
													break;
												case 'url':
													value = req.params[sourceName];
													break;
												case 'header':
													value = req.get(sourceName);
													break;
												case 'body':
												default:
													value = req.body[sourceName];
													break;
											}
											if(!value) {
												if(!$this.requests[n].optional) {
													new MaruResult(400, {error: 'Missing variable', variableName: sourceName}).cookResult(res);
													return;
												}
												else {
													continue;
												}
											}
											if(validate(value, $this.requests[n])) {
												requestObject[n] = $this.requests[n].type !== 'number' ? value : Number(value);
											}
											else {
												if(!$this.requests[n].optional) {
													new MaruResult(400, {error: 'Invalid variable', variableName: sourceName}).cookResult(res);
													return;
												}
											}
										}
									}
								}
								if(functions.hasOwnProperty($this.func)) {
									functions[$this.func].call(null, requestObject).then((result) => {
										if(!(result instanceof MaruResult)) {
											result = new MaruResult(result);
										}
										result.cookResult(res);
									}, (result) => {
										if(!(result instanceof MaruResult)) {
											result = new MaruResult(500, result);
										}
										result.cookResult(res);
									});
								}
								else {
									new MaruResult(501, {error: 'Invalid server config'}).cookResult(res);
								}
							};
							switch(m) {
								case 'post':
									app.post(f, worker);
									break;
								case 'put':
									app.put(f, worker);
									break;
								case 'delete':
									app.delete(f, worker);
									break;
								case 'get':
									app.get(f, worker);
									break;
							}
						}
					}
				}
			}
			app.listen(port);
		},
		app
	};
};