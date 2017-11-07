$( function( ){

	var fadeTime = 0;

    $( '#login-form-link' ).click( function( e ){
    	$( "#login-form" ).delay( fadeTime ).fadeIn( fadeTime );
 		$( "#register-form" ).fadeOut( fadeTime );
		$( '#register-form-link' ).removeClass( 'active' );
		$( this ).addClass( 'active' );
		e.preventDefault( );
	});
	$( '#register-form-link' ).click(function(e) {
		$( "#register-form" ).delay( fadeTime ).fadeIn( fadeTime );
 		$( "#login-form" ).fadeOut( fadeTime );
		$( '#login-form-link' ).removeClass( 'active' );
		$( this ).addClass( 'active' );
		e.preventDefault( );
	});

});
