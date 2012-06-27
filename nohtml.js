
function nohtml( load, callback ){

	nohtml.modules = {
		nh_page: { name: "nh_page", type: "javascript" , script: nohtml.filePath +"page/nh_page.js", 
		dependencies: [
 						{ name: "nh_page_stylesheet" , type: "css", script: nohtml.filePath +"page/nh_page.css" },
						{ name: "basic" , type: "css", script: nohtml.filePath +"ui/basic.css" },						
						{ name: "iscroll" , type: "javascript", script: nohtml.filePath +"requires/iscroll/iscroll.js" },
						{ name: "mustache" , type: "javascript", script: nohtml.filePath +"requires/mustache/mustache.js" }

					]
		},
		nh_list_view: { name: "nh_list_view", type: "javascript" , script: nohtml.filePath +"components/list_view/nh_list_view.js", 
		dependencies: [
 						{ name: "nh_list_view_stylesheet" , type: "css", script: nohtml.filePath + "components/list_view/default.css" },
						{ name: "basic" , type: "css", script: nohtml.filePath +"ui/basic.css" },				
						{ name: "iscroll" , type: "javascript", script: nohtml.filePath +"requires/iscroll/iscroll.js" }
					]
		}	
	}

	if(load == '' || load == undefined || load == null)
	{
		throw "error please supply modules you wish to load";
	}

	if(load instanceof Array){
	//load all modules then fire the callback when it completed.
	nohtml.executeLength = load.length;

		for(var i = 0 ; i < load.length; i++){
			var ii = load[i];
			if(nohtml.modules[ii] != undefined){
				nohtml.loadModule( nohtml.modules[ii] , callback);
			}
		}

	} else if (load instanceof String){

	}

}

// name of module, types of module, dependancy if any
nohtml.modules =  {


};

// global static variables;
// define the filePath for nohtml;
nohtml.filePath = '';

nohtml.alreadyLoaded = [];
nohtml.executeLength = 0;
nohtml.loadCount = 0;
nohtml.tabCount = 0;
nohtml.tabs = false;
nohtml.tabCollection = [];
nohtml.loadedAlreadyloaded = [];

nohtml.loadModule  = function(object, callback){
	
	var load = true;
	for(var i = 0; i < nohtml.alreadyLoaded.length; i++){
		
		if(object.name == nohtml.alreadyLoaded[i]){
			nohtml.loadCount++;
			load = false;
			

			if(nohtml.loadCount >= nohtml.executeLength){
				if(callback){ 
					callback();
					nohtml.loadCount = 0;
					return;
				}
			}
		}
	}

	nohtml.alreadyLoaded.push(object.name);

	if( load ){
		if (object.type == "js" || object.type == 'javascript'){ 
		//if filename is a external JavaScript file
			var fileref=document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", object['script']);
		}
		else if (object.type=="css"){ 
			//if filename is an external CSS file
			var fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", object['script']);
			nohtml.loadCount++;
		}

		if (typeof fileref!="undefined"){

			var complete = false;

			fileref.onload = fileref.onreadystatechange = function() 
			{
				if (true) {
				    complete = true;
				    
				    //remove listeners
				    if(object.type == "javascript")
				    {
						nohtml.loadCount++;
	 			    }

				    fileref.onload = fileref.onreadystatechange = null;	
				    // check to see if there any depenancy and load them through the same loop.
				    if(object.dependencies){
				    	nohtml.executeLength = nohtml.executeLength + object.dependencies.length;
				    	for(var i = 0; i < object.dependencies.length; i++){
				    		var ii = object.dependencies[i];
				    		nohtml.loadModule( ii , callback);
				    	}

				    } 

				    if(nohtml.loadCount >= nohtml.executeLength){
				    	if(callback){
				    		nohtml.loadCount = 0;
				    		callback();
				    		return;
				    	}
				    }

				} else if (this.readyState === 'loaded' && this.nextSibling == null) {
				    console.log('error via ie');
				}
			}

			var head = document.getElementsByTagName("head")[0]
			head.insertBefore(fileref, head.childNodes[0]);
		}
	}

}



// if tabs are true then activate the tab bar.
nohtml.addTab = function(object){
	object.id = "test";
	nohtml.tabCollection.push(object);
}

nohtml.showTabs = function(){

	tabTemplate  = '<div class="{{#type}} tab-{{type}} {{/type}}tab tab-{{name}}">\
					{{#logo}} <div class="icon-{{logo}}" > </div> {{/logo}}\
	 				</div>';
	tabContainer = '<div id="tab-container"> <div id="tab-relative"> {{{tabs}}} </div></div>';

	var tabs = '';
	for(var i = 0; i < nohtml.tabCollection.length; i++ ){
		tabs += Mustache.render(tabTemplate, nohtml.tabCollection[i]);
	}
	var tabs = {'tabs': tabs};
	var template = Mustache.render(tabContainer, tabs);	
	$('body').append(template);
	nohtml.tabs = true;
}




 