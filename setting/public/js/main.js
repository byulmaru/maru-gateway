let app = new Vue({
	el: '#main',
	data: {
		setting: {}, newRequest: ''
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
		addRequests(prop, name) {
			if(name) {
				this.$set(prop, name, {type: 'string', source: 'body', name, optional: false});
				this.newRequest = '';
			}
		}
	}
});

$.getJSON('/update', (data) => {
	app.setting = data;
});