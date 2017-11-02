$( function(){

	$("#menu-toggle").click( function( e ){
	    e.preventDefault();


	    if( $( "#menu-toggle:contains('Filter items')" ).length ){ //show filters

            $('#menu-toggle').html("Hide filters");
        } else {													//hide filters
        	$('#menu-toggle').html("Filter items");
        }

       	$("#wrapper").toggleClass("toggled");

	});

});