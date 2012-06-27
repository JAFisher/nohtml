$('document').ready(function(){

var example = new nh_database();

example.save({ key:'helloworld', values:[1,2,3,4,5] });
example.remove('helloworld');

})