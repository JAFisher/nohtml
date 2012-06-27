function app()
{
	$(document).ready(function(){
		app.createView();

		nohtml.loadModule(["nh_page"]);

	})
}

//pages are global so they can be activated anywhere.
var page = new nh_page();
var page2 = new nh_page();

var data = '';

page2.head_template = '<div class="header" id="head_{{id}}"> \
					   <div class="goBack" onclick="nh_page.goBack()"> Go Back </div> \
					   <div> {{#title}} {{title}} {{/title}} </div> \
					   </div>';

app.createView = function()
{	
	//example of using the list template.
	var peridocTable = 	'<li id="{{id}}"  class="symbolbox" \
							 onclick="app.detailedView({{id}})" \
							class="{{#_featured}} featured {{/_featured}} \
							{{#_seperator}} odd {{/_seperator}} \
							{{#group}} group_{{group}} {{/group}}" \
						> \
							{{#image}} \
								<img class="image" src="{{image}}" /> \
							{{/image}} \
							{{#symbol}} \
								<div class="Large"> {{symbol}} <span class="small"> \
								{{id}} </span> </div> \
							{{/symbol}} \
							{{#element}} \
								<div class="fullname"> {{element}} </div> \
							{{/element}} \
						</li> ';

	$.get('exampledata.json',
	function(response)
	{
		data = JSON.parse(response);

		list = new nh_list_view();
		list.data = data;
		list.template = peridocTable;
		list.id = "hello";

		page.head.title = "Periodic Table";
		page.modules = [list];
		page.data = {list_view: list.render() };
		page.template = "{{{list_view}}}";
		page.show();
	});
}

app.detailedView = function(id)
{	
	var element = data[id - 1];
	page2.head.title = element.element;
	page2.body.symbol = element.symbol;
	page2.body.fullname = element.element;
	page2.body.description = element.description;
	page2.tweener = "left";

	page2.body_template = '<div id="body_{{_id}}" class="body" > <div id="body_scroller_{{_id}}">\
	<div id="full"> \
	<div class="title" > The Chemical Symbol of <span class="xl"> {{fullname}} </span> is \
	<span class="xl"> {{symbol}} <span> </div>\
	{{{description}}} \
	</div> \
	{{{_modules}}} </div> </div>';

	page2.iScroll = true;
	page2.show();
}

app();
 