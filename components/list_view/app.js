
function app()
{

	app.createView();
}

var list;
var list2;

app.createView = function()
{	

	var data = [];
	for(var x = 0; x < 1000; x++)
	{
		data.push({
					id: x,
					onclick: "ap_gallery",
					image: "http://images.fanpop.com/images/image_uploads/Fanpop-all-around-the-world-fanpop-583858_1024_768.jpg",					
					text: 'woah woah woah sdsadsa dsa dsadsad asdsadsadsa dsadsadsa dsadsa dsadsa d sadsad \
					 woah asd sadsadsa sad sad asd sad sadsad sadsads asdadsa dsadsad sa' + x,
					_featured: false
				  })
	}
	
	// all the data is loaded so modifiy the view.
	list = new nh_list_view();
	list.id = "a";
	list.data = data;
	list.appendTo = '#appendIt';
	list.build();	


	list2 = new nh_list_view();
	list2.id = "b";
	list2.data = data;
	list2.appendTo = '#appendLeft';
	list2.build();


}


// returns the prototypes to the fn handler.
app();