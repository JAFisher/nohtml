function nh_page( config )
{	

	config = (config) ? config : {};
	this.id = (config.id == undefined) ?  nh_page._id++ : config.id;
	nh_page.pages.push(this.id);

	this.container_template = '<div id="nh_page_{{_id}}"" class="nh_page"> {{{head}}} {{{body}}} </div>';
	this.body_template = '<div id="body_{{_id}}" class="body" > <div id="body_scroller_{{_id}}" class="body_scroller"> {{{_modules}}} </div> </div>';
	this.head_template = (config.head_template) ? config.head_template : 
	'<div class="header" id="head_{{_id}}"> \
	 <div> {{#title}} {{title}} {{/title}} </div> \
	 </div>';

	this.iScroll = (config.iScroll) ? config.iScroll : false; 
	this.head = (config.head) ? config.head : 
	this.head = {
		title: 'Page ' + this.id ,
		_id: this.id
	}

	this.body = (config.body) ? config.body:
	this.body = {
		_id: this.id
	}

	this.modules = (config.modules) ? config.modules : null;
	this.template = (config.template) ? config.template : '{{.}}';

	this.data = (config.data) ? config.data : null;
	this._active = (config.active) ? config.active : false;
	this.appendTo = (config.appendTo) ? config.appendTo : 'body';
}

//global scope of the object
nh_page.pages = [];
nh_page.active = [];
nh_page.previous = [];
nh_page.animating  = false
nh_page._id = (nh_page._id) ? nh_page._id++ : 0;
nh_page._iScroll = {

}

nh_page.prototype.setId = function(id){
	this.head._id   = id;
	this.body._id  = id;
	this.id = id;
}

nh_page.goBack = function(direction)
{
	if(nh_page.animating == false){
	 	if(nh_page.previous.length >= 1)
		{
			var length = nh_page.previous.length -1;
			if(length < 0 )
			{

			} else if (length == 0) {
				nh_page.animate(direction, nh_page.previous[length], nh_page.active[0], true);
				nh_page.active.push( nh_page.previous.pop() );
				nh_page.previous.push( nh_page.active.shift() );
			} else {
				nh_page.animate(direction, nh_page.previous[length], nh_page.active[0], true );
				nh_page.active = [];
				nh_page.active.push( nh_page.previous.pop() );  			
			}
		}
	}
}

nh_page.prototype.currentPage = function()
{	
	return nh_page.active[nh_page.length - 1] ;
}

nh_page.prototype._animate = function()
{

}

nh_page.prototype._template = function( _template , data  )
{
	var template = ( _template != undefined) ? _template : this.template;
	return Mustache.to_html(  template, data );
}


nh_page.prototype.show = function()
{	
	// checks the dom to see if a page already exists with the same id.
	// if so it doesn't cache the page but removes it.
	if(this.currentPage() == this.id){
		return;
	}

	//animation catching as well
	if(nh_page.animating == false)
	{

		nh_page.active.push(this.id);		
		//page previously exists destory the first page.

		if(this.data != null)
		{

			var modules = Mustache.render(this.template, this.data);
			this.body._modules = modules;
		}

		var tweener = null;
		var animate = false;

		if(nh_page.active.length > 1)
		{	 
			if(this.tweener == null) {
				tweener = tweener = 'left';
				animate = true;
			} else {
				animate = true;
				tweener = this.tweener;
			}
			
		} else {
			animate = false;
		}

		// mixes the body and head.
		var page = {
			head : Mustache.render(this.head_template, this.head),
			body : Mustache.render(this.body_template, this.body),
			_id: this.id,
			tween: tweener
		}

		var container = this._template(this.container_template, page);

	 	$(this.appendTo).append(container);

	 
	 	if(animate)
	 	{	
	  		nh_page.animate(tweener,this.id,nh_page.active[0]);
	  		nh_page.previous.push( nh_page.active.shift() );
	 	} else {
	 		$('#nh_page_'+this.id).addClass('active')
	 	}

	 	if(this.iScroll == true)
	 	{
	 		var iBody = $('#body_'+this.id)[0];
	 		nh_page._iScroll[this.id] = new iScroll(iBody,{
	 			checkDOMChanges : false
	 		})
	 	 
	 	}


	  	if(this.modules)
	 	{ 
		 	// page has loaded fire the onload event. also loop through modules and _active them.
		 	for(var i = 0; i < this.modules.length; i++)
		 	{	
		 		this.modules[i]._active();
		 	}
	 	}
 	}
}


//speficy what you want to animate in and where.
//can handle one page, two page and different tween and smoothing options.
nh_page.animate = function(tween, page_one, page_two, backwards)
{
	if( backwards ){
		tween = this.lastTween +"_backwards";
	} else {
		this.lastTween = tween;
	}

	if(nh_page.animating == false)
	{
 		nh_page.animating = true;
	 	var animation = $('#nh_page_'+page_one)[0];
		var animation_parent = $('#nh_page_'+page_two)[0];

		$(animation).removeClass('active');
		$(animation_parent).removeClass('active');
	 	$(animation).addClass(tween);
	 	$(animation_parent).addClass(tween+'_parent');
	 	$(animation_parent).addClass('nh_animating');
	 	$(animation).addClass('nh_animating');

		animation_parent.addEventListener('webkitAnimationEnd', function()
		{
			this.style.webkitAnimationName = '';
			$(this).removeClass(tween+'_parent');
	 		this.removeEventListener('webkitAnimationEnd',arguments.callee,false);
	 		nh_page.animating = false;
			$(this).removeClass('nh_animating');

		}, false);

		var that = this;
		animation.addEventListener('webkitAnimationEnd', function()
		{
			
			this.style.webkitAnimationName = '';
			$(this).removeClass(tween);
			$(this).addClass('active');
			nh_page.animating = false;
			$(this).removeClass('nh_animating');
			this.removeEventListener('webkitAnimationEnd',arguments.callee,false);

			//this destory the backwards functionality of pageTwo
			if(backwards){
				that.prototype.destory(page_two);
			}

		}, false); 

		animation.style.webkitAnimationDuration = 500;
		animation_parent.style.webkitAnimationDuration = 500;
		animation_parent.style.webkitAnimationFillMode = "forwards";
		animation.style.webkitAnimationFillMode = "forwards";
		animation.style.webkitTransformStyle = "preserve-3d";
		animation_parent.style.webkitTransformStyle = "preserve-3d";
		animation.style.webkitAnimationName  = tween;
		animation_parent.style.webkitAnimationName  = tween+'_parent';

	}
}

//garbage collector destorys unused iScroll instances.
nh_page.prototype.destory = function(id)
{
	$('#nh_page_'+id).remove();
	
	//need to use a global reference to iscroll as eventlisteners animations
	if(nh_page._iScroll[id] != undefined)
	{	
		nh_page._iScroll[id].destroy();
		nh_page._iScroll[id] = undefined;
	}
	
}


