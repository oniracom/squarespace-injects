
Y.on('domready', function () {
	var buttonWrapper = Y.Node.create('<div id="home-top-buttons"></div>');
	buttonWrapper.append(Y.Node.create('<a href="/tickets" class="sqs-editable-button">get tickets</a>'));
	buttonWrapper.append(Y.Node.create('<a href="/festival-information" class="sqs-editable-button">the festival</a>'));

	Y.Node.one('#collection-5746db4c9f7266e08f9b2bd0 #content-wrapper').insert(buttonWrapper, Y.Node.one('#page-5746db531d07c0426d6b2944'));
});

// Y.Node.all('#collection-5746db4c9f7266e08f9b2bd0 #content-wrapper .parallax-item').shift().insert(
/*
#collection-5746db4c9f7266e08f9b2bd0 .content-wrapper .parallax-images:first-child {

}
*/