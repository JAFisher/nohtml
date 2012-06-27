#Documentation for the NH (nohtml: List View)

###Description:  

A scrollable list view which Lazy loads 
DOM objects so the DOM is never overloaded, 
this is designed for mobile web development in mind.
Easily templatable lists from global to object level, with some handy helper functions to manage
your list data more efficently.

Tested on Android & IOS

###Credition

Module Name: nh_list_view  
Module Developer: JFisher  
Documentation: JFisher  
Verison: 1.0  
Updated: 21th June 2012  


##Loading nh_list_view;

To load all the list_view and all it required libaries simply

```
nohtml(["nh_list_view"], function(){
	//loaded
}); 
```

##Quick Class Overview:

####appendTo = Selector;

Where to build the list.   

####data( JSON{} || Array [] )

Data you wish to view in an list.  
Protected parameters 
_template: new mustache template : String  
_featured: Boolean  
_seperator: 2 ( default) : _seperator evalutes
 to two so you can do odd even rows this number is configurable.
									
####lazyLimit( 20 )
Default 20 for onset and offset of lists. 

####template( MustacheString ) 
Mustache template you wish to render.  

####build()							
Creates the list.  

####destory()						
Destorys the list deallocating memory.

####id( 'main' ) 						
ID of your div scroller = lv_scroller_main and 
container div list_view_main.
								  

##First include the following files

* default.css
* nh_list_view.js
* iscroll.js
* mustache.js
* zepto.js

##a simple list:
Define your list data on creation or afterwards.

###on creation
```
var list = new nh_list_view(); 
list.data = [1,2,3,4,5,6,7,8,9];
list.build();
```

###after creation
```
var list( { data: [1,2,3,4,5,6,7,8,9] } );
list.build();
```

it's simple as that, this will create an list view on BODY element,

##Changing the build location using appendTo:
```list.appendTo( selector );```

##an more complex listview
This is where the fun happens, list views you will want to build will generally be complex
JSON objects nh_list_view leverages the power of mustashe templates.

```
var list = new nh_list_view({
	data:[{
		id:0,
		text: 'Subscribe to swanify app development news letter, leading the way HTML5 apps',
		image: 'http://swanify.10t.co.uk/wp-content/uploads/2011/02/loho.png',
		onclick: "alert(12345)"
	},
	{
		id:1,
		text: 'Sexiest developer on the planet? the big geek off begins in Fife.',
		image: 'http://swanify.10t.co.uk/wp-content/uploads/2011/02/loho.png',
		onclick: "alert(12345)",
		_featured: true
	}]
)}

list.build();
```

You'll notice a couple interesting things about the default template. you can give an onclick
event to trigger other functions, an image item and an id for your li.

You may also noticed that the _featured data tag this is a protected variable that allows you 
to push items to the top no matter what there position is in the list, you may style this LI 
differently as it has the featured class attached to the li.


##Templating your lists

###default template for reference:

```
<li id="{{id}}" \
{{#onclick}} onclick="{{onclick}}" {{/onclick}} \
class="{{#_featured}} featured {{/_featured}}" \
> \
	{{#image}} \
		<img class="image" src="{{image}}" /> \
	{{/image}} \
	{{#text}} \
		<span> {{text}} </span> \
	{{/text}} \
</li>';
```

The default template powering nh_list_view may not match your design specifcation
for example you might have two images in one dataset
and this template can't support two images uh oh!!! dont panick.
Just use your own template and pass it in.

```
var list = new nh_list_view({
	data:[{
		id:0,
		promo_image: 'http://swanify.10t.co.uk/wp-content/uploads/2011/02/loho.png',
		image: 'http://swanify.10t.co.uk/wp-content/uploads/2011/02/loho.png'
	},
	{
		id:1,
		promo_image: 'http://swanify.10t.co.uk/wp-content/uploads/2011/02/loho.png',
		image: 'http://swanify.10t.co.uk/wp-content/uploads/2011/02/loho.png'
	}]
)}

list.template = '<li id="{{id}}" \
{{#onclick}} onclick="{{onclick}}" {{/onclick}} \
class="{{#_featured}} featured {{/_featured}}" \
> \
	{{#image}} \
		<img class="image" src="{{image}}" /> \
	{{/image}} \
	{{#promo_image}} \
		<img class="promo_image" src="{{promo_image}}" /> \
	{{/promo_image}} \
	{{#text}} \
		<span> {{text}} </span> \
	{{/text}} \
</li>';

list.build();
```

Hey pretso you built a new custom list, well done.

##Templating at an object level.

similiar to the problem above we may want multiple templates attached to one list
this is easily done just use the data parameter _template	

```
var template_one = '<li id="{{id}}" \
{{#onclick}} onclick="{{onclick}}" {{/onclick}} \
class="{{#_featured}} featured {{/_featured}}" \
> \
	{{#image}} \
		<img class="image" src="{{image}}" /> \
	{{/image}} \
	{{#promo_image}} \
		<img class="promo_image" src="{{promo_image}}" /> \
	{{/promo_image}} \
	{{#text}} \
		<span> {{text}} </span> \
	{{/text}} \
</li>';


var template_two = '<li id="{{id}}" \
{{#onclick}} onclick="{{onclick}}" {{/onclick}} \
class="{{#_featured}} featured {{/_featured}}" \
> \
	{{#title}} \
		<h2>  {{title}} </h2>\
	{{/title}} \
	{{#subtext}} \
		<span> {{subtext}} </span>\
	{{/subtext}} \
	{{#text}} \
		<span> {{text}} </span> \
	{{/text}} \
</li>';

var list = new nh_list_view({
	data:[{
		id:0,
		promo_image: 'http://swanify.10t.co.uk/wp-content/uploads/2011/02/loho.png',
		image: 'http://swanify.10t.co.uk/wp-content/uploads/2011/02/loho.png',
		template: template_one
	},
	{
		id:1,
		title: 'cats with thumbs, a door opening epademic'
		text: 'nothing but text to must',
		subtext: 'nothing but text to must',
		onclick: "alert('cats with thumbs!!')",
		_template: template_two
	}]
)}

list.build();
```

Simple as that.

####good tutorials on mustache templates
http://coenraets.org/blog/2011/12/tutorial-html-templates-with-mustache-js/