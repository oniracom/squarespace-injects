

function bitDate(data) {
	var self = this;
	self.date = data.datetime.substring(5, data.datetime.length).slice(0,-9);
	self.venue = data.venue;
	self.formatted_location = data.formatted_location;
	self.ticket_url = data.ticket_url;
	self.title = data.title;
	self.description = data.description || "";
	self.artists = data.artists.slice(0, 5);
	self.artists.shift();
	self.twitterShare = ko.computed(function() {
		return 'https://twitter.com/intent/tweet?url='+encodeURIComponent('{path=site_index}tour')+'&text='+escape(self.title+' on '+self.date)+'&related={twitterHandle},twitterapi';
	});

	self.fbShare = ko.computed(function() {
		return 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('{path=site_index}tour');
	});

	this.active = ko.observable(false);

	self.google_map_img = ko.computed(function() {
		return 'https://maps.googleapis.com/maps/api/staticmap?center='+self.venue.latitude+','+self.venue.longitude+'&zoom=13&size=376x300&maptype=roadmap%20&markers=color:orange|label:G|'+self.venue.latitude+','+self.venue.longitude+'&sensor=false';
	});

	self.directions = ko.computed(function() {
		return 'https://maps.google.com/maps?daddr='+self.venue.name+'&amp;hl=en&amp;sll='+self.venue.latitude+','+self.venue.longitude;
	});
	//self.date = 
}

function bitViewModel(limit) {

	var self = this;

	self.tourDates = ko.observableArray([]);

	var bitCurl = 'https://api.bandsintown.com/artists/{bitArtist}/events.json?api_version=2.0&app_id=OniracomGLove&callback=?'
	$.getJSON(bitCurl,  function(data){
		var bitDates = $.map(data, function(date) {  return new bitDate(date); });
		if(limit != undefined) {
			bitDates = bitDates.slice(0,limit);
		}
        self.tourDates(bitDates);
	});

	self.activate = function(date) {
		if(date.active()) {
			date.active(false);
		} else {
			$.each(self.tourDates(), function(index, tourDate) {
				tourDate.active(false);
			});
			date.active(true);
		}
	}
}


ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};
