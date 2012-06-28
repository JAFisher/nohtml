//pages are global so they can be activated anywhere.
var page;
var page2;
var data = '';
var list;
var peridocTable = 	'<li id="{{id}}"  class="group_{{group}} symbolbox" \
			onclick="app.detailedView({{id}})" \
			class="{{#_featured}} featured {{/_featured}} \
			{{#_seperator}} odd {{/_seperator}} \
			{{#group}} group_{{group}} {{/group}}" > \
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

function app()
{

	$(document).ready(function(){

		nohtml.filePath = "../../";
		nohtml(["nh_page", "nh_list_view"], function(){
			
		page = new nh_page();
		page2 = new nh_page();
		nohtml.addTab({ name:"filter0", type:"button", logo: "glass" });
		nohtml.addTab({ name:"filter1", type:"button", logo: "leaf" });
		nohtml.addTab({ name:"filter2", type:"button", logo: "person" });
		nohtml.addTab({ name:"filter3", type:"button", logo: "dog" });

		nohtml.showTabs();
		

		page2.head_template =  '<div class="header" id="head_{{id}}"> \
					<div class="nh-back " onclick="nh_page.goBack()"> </div> \
					<div onclick="nh_page.goBack()" \
					class="icon-back nh-back-child"> </div> \
					<div> {{#title}} {{title}} {{/title}} </div> \
					</div>';	
		app.createView();

		});

	})
}


app.createView = function()
{	
	//example of using the list template
	$.get('exampledata.json',
	function(response)
	{
		data = JSON.parse(response);

		list = new nh_list_view();
		list.data = data;
		list.template = peridocTable;
		list.id = "hello";
		list.lazy = false;

		page.head.title = "Periodic Table";
		page.modules = [list];
		page.data = {list_view: list.render() };
		page.template = "{{{list_view}}}";
		page.show();
	});
}

// this example shows a mix in with the previous list_view module showing how you can reuse modules over and over.
app.detailedView = function(id)
{	
	var element = data[id - 1];
	page2.head.title = element.element;
	page2.body.symbol = element.symbol;
	page2.body.fullname = element.element;
	page2.body.description = element.description;
	//example of reusing data :)
	list = new nh_list_view();
	list.template = peridocTable;
	list.id = "hello" + id;
	list.data = data;
	//disable lazy and iscroll as page2 scroll is on.
	list.lazy = false;
	list.scroll = false;
	// module you want to use
	page2.modules = [list];
	// need to make a setId function
	page2.setId("detailedView" + id);
  
	// data being used by the modules
	page2.data = {list_view: list.render() };
	page2.tweener = "left";
	//modules templates
	//pass is the data list_view remember modules need a {{{ for raw encoding
	page2.template = "<div style='background-color:#fff;display:inline-block;width:100%'> <h3 style='margin-left:25px;'> More Elements:</h3> </div> \
					  {{{list_view}}}";

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
 