function nh_database(){
	 nh_database;
}

nh_database.prototype.save = function(value, callback){
	
	Lawnchair( function(){
		this.save(value);
		if(callback) callback();
	});

}


nh_database.prototype.remove = function( key , callback ){
	
	Lawnchair( function(){
		this.remove(key);
		if(callback) callback();
	});

}


