let formCreate = document.querySelector('#modal-create form');

formCreate.save().then(json => {
	window.location.reload();
}).catch(err => {
	console.log(err);
});
