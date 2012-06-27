// define variable ap_list_view


function nh_list_view (config)
{
	var defaultTemplate = '<li id="{{id}}" \
									{{#onclick}} onclick="{{onclick}}" {{/onclick}} \
									class="{{#_featured}} featured {{/_featured}} \
									{{#_seperator}} odd {{/_seperator}}" \
								> \
								{{#image}} \
									<img class="image" src="{{image}}" /> \
								{{/image}} \
								{{#text}} \
									<div class="text"> {{text}} </div> \
								{{/text}} \
							   </li> \
							   ';

	if(config == undefined) 
	{
		
		this.stylesheet = 'default.css';
		this.appendTo  = "body";
		this.data = [];
		this.seperator = 2;
		this.name = "list_view";
		this.id = 0;
		this.scroller = null;
		this.template = defaultTemplate;
		this.lazyLimit = 20;
		this.lazyStart = 0;
		this.lazy = true;
		this.scroll = true;


	} else {

		
		this.stylesheet = 'default.css',
		this.appendTo =( config.appendTo) ? config.appendTo : 'body',
		this.data = (config.data) ? config.data : [],
		this.seperator = (config.seperator) ? config.seperator : 2,
		this.name = "list_view",
		this.id = (config.id) ? config.id : 0,
		this.scroller = null,
		this.template = (config.template) ? config.template : defaultTemplate
		this.lazyLimit = (config.lazyLimit) ? config.lazyLimit : 20;
		this.lazyStart = (config.lazyStart) ? config.lazyStart : 0;
		this.lazy = (config.lazy) ? config.lazy : true;

	}




}

nh_list_view.prototype.build = function()
{	
 	if(this.data == undefined) throw ('config.data is required');
 	if(this.id == undefined) throw ('config.id is required');

	if(this.data)
	{ 

		$(this.appendTo).append(' <div id="lv_scroll_'+this.id+'" class="wrapper"> \
		<div id="list_view_'+this.id+'" class="scroller"> <ul> </ul> </div> </div>');
		
		var html = "<ul>";

		//reassigns featured to top
		this.data = this.sorter(this.data);
		//saves the data before lazy loading it;
		this.fullData = this.data.slice(0);
		this.lazyLoad();
	}

}

/*	
	lazy interval happens every 100 ms to check to see if the scroll bar has exceeded the
  	position limit it then proceeds to pop and push the next or previous state according
  	to the lazyLimit applied. recommend using a min limit of 15. otherwise the pop and pushing
  	will just occur to fast.
*/

nh_list_view.prototype.lazyInterval = function(that)
{
	var scroll = that.scroller;
	if(that.scroll)
	{
		var mscroll = scroll.maxScrollY ;
		if(that.lazyActive != true)
		{

			if(scroll.y < mscroll * 0.8 )			
			{
				that.lazyActive = true;
				that.lazyLoad(true);
			}

		}
		if(that.lazyActive != true)
		{
			if(that.lazyPages > 2) 
			{

			}
		}
		
		if(!that.longInterval)
		{
			clearInterval(that.interval);
			that.longInterval = true
			that.interval = setInterval(that.lazyInterval, 500, that);
		}
	}
	
}


nh_list_view.prototype.lazyLoad = function(rendered, loadBackup)
{
	
	var lazyload = this.fullData.slice(0);
	var original = lazyload;

	if(this.lazy == false){
		this.lazyLimit = this.fullData.length;
	}

	if(original.length > 20)
	{
		if(this.lazys == undefined)
		{
			this.lazyPages = 2;
			this.lazyEnd = original.length;
			this.lazys = true;
			this.interval = setInterval(this.lazyInterval, 1000, this);
			this.arrayUp = lazyload.slice(0, (this.lazyLimit + (this.lazyStart + this.lazyLimit))  * 2);

			var newinner = "";
			if(rendered == true) {

			} else {

				for(var i = 0; i <  this.lazyLimit ; i++)
				{
					var o = lazyload[this.lazyStart + i];
					newinner += this._template(o);
				}
				$('#list_view_'+this.id+' ul').append(newinner);

			}

			var scroll = $('#lv_scroll_'+this.id)[0];
			if(this.scroll){
				//work around for lazy load.
				$(scroll).css('height', '100%');
				this.scroller = new iScroll(scroll, {
					checkDOMChanges: true
	 			});
				this.scroller.refresh();

	 		}


		} 

		if(loadBackup)
		{
			

		} else {

			if( rendered  && (this.lazyStart +  this.lazyLimit) < this.lazyEnd)
			{	
				this.lazyStart =  this.lazyStart +  this.lazyLimit;	

				var appendData = this.limitArraytoString( this.arrayUp , this.lazyStart , (this.lazyLimit + this.lazyStart));
				var currentList = $('#list_view_'+this.id+' ul').find('li');
				
 				$('#list_view_'+this.id+' ul').append(appendData);	

 				var scrolling;
 				var that = this.scroller;
 				var duration = Date.now() - that.startTime;

 				that.refresh();
				this.lazyPages++;

				setTimeout( function(that){
					that.arrayUp = lazyload.slice(0, (that.lazyLimit + that.lazyStart)  * 2);
					that.arrayDown = lazyload.slice(0, (that.lazyLimit + that.lazyStart)  * 2);
				}, 10, this)

				setTimeout( function(that){
					that.lazyActive = false;
				}, 10, this)	
				
				 
			} else if (rendered == undefined){

				return lazyload;			
			
			} else {

				this.lazyActive = false;
			}
		}

	} else {

		return lazyload;
	}

}



nh_list_view.prototype.limitArraytoString = function(array, start, end)
{
 	var string = '';
	for(var i = 0; i < array.length; i++)
	{
		if(i + start >= this.lazyEnd)
		{
			break;
		}

		string += this._template(array[i + start]);
		
		if(i + start == end)
		{
			break;
		}
	}
	
	return string;
}

//sorter arranges data into seperators, also does featured_to_top function 
//this is where protected paramters will rearrange data correctly first time.
nh_list_view.prototype.sorter  = function(htmlList)
{
	htmlList = $(htmlList);
	var list = htmlList;
	var tofront = []; var toback = [];
	var combined = [];

	for(var i = 0 ; i < list.length ; i++)
	{

		if(!isNaN(this.seperator))
		{
			if(i % this.seperator)
			{
				list[i]._seperator = true;
			}
		}

		if(list[i]['_featured'] == true){
			tofront.push(list[i]);
		} else {
			toback.push(list[i]);
		}
	}

	combined = tofront.concat(toback);
	//converts the combined back to html
	return combined;
}

//applies the template onto the list view, where the magic happens.
//can use the global template or a object._template level.
nh_list_view.prototype._template = function(data)
{
	var template = ( data._template != undefined) ? data._template : this.template;
	return Mustache.to_html(  template, data );
}


nh_list_view.prototype._render = function(data)
{
	var template = ( data._template != undefined) ? data._template : this.template;
	return Mustache.render(  template, data );
}


//go deeper in the loop and span out the other collections.
//html encode verison
nh_list_view.prototype.goDeeper = function(object)
{	
	var html = '';
	html += this._render(object);
	return html;
}



nh_list_view.prototype.destory = function()
{
	delete this;
}

//when you just want to render the list and not built it out.
nh_list_view.prototype.render = function()
{
	var render = '';
	//sorts the data first;
	this.data = this.sorter(this.data);
	this.fullData = this.data.slice(0);

	if(this.lazy == false){
		this.lazyLimit = this.fullData.length;
	}

	var limit = this.data.slice(0,this.lazyLimit);
 
		for(var i = 0; i <  limit.length; i++ )
		{	
 			
			if( limit[i].length == undefined && typeof( limit[i] ) == 'object')
			{
				//this is not an array of object but a collection of object so go deeper into the collection.
				var ii = this.goDeeper(  limit[i] );
				render += ii;

			} else {

				render += '<li>';
				render += limit[i];
				render += '</li>';

			}
 		}	

	var template = '<div id="lv_scroll_'+this.id+'" class="wrapper"> \
		<div id="list_view_'+this.id+'" class="scroller"> \
		<ul>'+render+'</ul> </div> </div>';


 	return template;
}

nh_list_view.prototype._active = function()
{
	this.lazyLoad(true);
}

