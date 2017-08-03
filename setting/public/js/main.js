let app = new Vue({
	el: '#main',
	data: {
		setting: {}, newRequest: '', newURL: '/', newMethod: 'get'
	},
	methods: {
		styleBadge(method) {
			switch(method) {
				case 'get':
					return 'label-primary';
				case 'post':
					return 'label-success';
				case 'put':
					return 'label-info';
				case 'delete':
					return 'label-warning';
			}
		},
		addRequest(prop, name) {
			if(name) {
				this.$set(prop, name, {type: 'string', source: 'body', name, optional: false});
				this.newRequest = '';
			}
		},
		deleteRequest(data, name) {
			Vue.delete(data.requests, name);
		},
		addURL() {
			if(!this.setting[this.newURL]) {
				this.$set(this.setting, this.newURL, {});
			}
			this.$set(this.setting[this.newURL], this.newMethod, {requests: {}, func: ''});
			this.newURL = '/';
			this.newMethod = 'get';
		}
	}
});

$.getJSON('/update', (data) => {
	app.setting = data;
});