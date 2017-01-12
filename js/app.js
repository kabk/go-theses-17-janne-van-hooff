var position;

// Deze doet alle magie :)
function scrollert( event, direction ){ // Deze functie roepen we aan als we iets willen doen

    position += direction; // Zorg dat er verschil is in heen en terug scrollen

    // Alles moet in 1-25 blijven anders schuiven ze "uit beeld"
    if(position > 25) {
        position = 1;
    }
    if(position < 1) {
        position = 25;
    }

    // Geef alle elementen de volgende positie
    for (i = 1; i < 26; i++) {

        var offset = position + i; // Bepaal per element wat de nieuwe positie moet worden
        if(offset > 25) { // Als de nieuwe positie groter dan positie 25 is
            offset-=25; // Begin dan weer vanaf 1
        }
        if(offset < 1){ // Als de nieuwe positie kleiner is dan 25
            offset+=25; // Begin dan met terugtellen van 25
        }

        loadTile( i, offset ); // Vul de div
    }

    // Animieer die zooi

}

function loadTile( Space,  Offset) {
    //    $('#space_' + Space ).load( "/content/page_" + Offset + ".html" ); // Vul de div
//    $('#space_' + Space ).load( "/content/page_" + Offset + ".html" ); // Vul de div

        $.ajax({
            url: "./content/page_" + Offset + ".html",
            crossDomain: false,
//            isLocal: true, //deze uitzetten als hij live gaat!
        })
            .done(function( data ) {
            $('#space_' + Space ).html(data);
        });
}

// Deze voegt alle event-listeners toe en vult hem voor de eerste keer zodra de pagina geladen is
$( document ).ready(function() {
    position = 1;

    // Vul alle div-jes met page_1.html t/m page_25.html
    for (i = 0; i < 25; i++) { 
        var number = i + 1;

        loadTile( number, number );
    }

    /*
     * Hieronder checkt de code of er pijltjes gebruikt worden en/of gescrolled word
     *
     */

    // Als je de pijltjes gebruikt moet er iets gebeuren
    $(window).keydown(function(e) { // De jQuery.keydown() vangt op of je op een knop drukt op je toetsenbord

        switch(e.which) { //Hier controleren we welke key er ingedrukt word
            case 37: // links
                scrollert( e, -1 );
                break;
            case 38: // omhoog
                scrollert( e, -1 );
                break;

            case 39: // rechts
                scrollert( e, 1 );
                break;

            case 40: // omlaag
                scrollert( e, 1 );
                break;

            default: return; // nodig omdat je anders geen andere knoppen meer kan indrukken
        }
        e.preventDefault(); // dit zorgt er voor dat de "normale" gebeurtenissen niet gebeuren (scrollen met de pijltjestoetsen in dit geval)
    });

    // Als je scrolled moet er iets gebeuren    
    $(window).bind('mousewheel', function(e) { // Omdat we willen weten welke kant er op gescrolled word gebruiken we geen jQuery.scroll() maar jQuery.bind('mousewheel')
        if (e.originalEvent.wheelDelta >= 0) { // Als je omhoog scrolled is de e.originalEvent.wheelDelta positief
            scrollert( e, -1 );
        }
        else { // Als je omlaag scrolled is de e.originalEvent.wheelDelta negatief
            scrollert( e, 1 );
        }
    });


});


