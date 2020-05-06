console.log('ok');
console.log('jQuery ok ->', $);

/*****************************
 * 
 * BOOLFLIX / just a Netflix copy 
 * 
 *****************************/

 $(document).ready( function() {
    /**
     * SETUP
     */

    // refs
    var apiFilms = 'https://api.themoviedb.org/3/search/movie';
    var apiSeries = 'https://api.themoviedb.org/3/search/tv';
    var inputSearch = $('.main-header input#search');
    var sectionResults = $('.main .main_result-search');
    var sectionFilms = $('.main .main_result-search #films');
    var sectionSeries = $('.main .main_result-search #series');

    
    // Init Handlebars
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);

    // Avvia ricerca con "INVIO" ed ad ogni click sulla SPACEBAR
    inputSearch.keyup(function(event) {
            
            /**
             * L'idea è quella di poter filtrare man mano la ricerca mentre scrivi
             * usando quindi 
             */
            if(event.which == 13 || event.which == 32) {
                search(inputSearch, sectionFilms, sectionSeries, apiFilms, apiSeries, template)
            };

        
    });


 }); // <- End Doc Ready 

/*********************
 *  FUNCTIONS
 *********************/


//Funzione per la ricerca dell'utente / Con reset iniziale
function search(inputSearch, sectionFilms, sectionSeries, apiFilms, apiTv, template, starAverage, movieDetail, movieOverlay) {

    // reset contenuti main
    reset(sectionFilms, sectionSeries);

    var posterBaseUrl = 'https://image.tmdb.org/t/p/'
    var posterSizes = 'w342';

    // FILM - ricerca dell'utente / gestisce chiamata API film
    if(inputSearch.val() != '') {

        // chiamata api con query in input
        $.ajax({
            url: apiFilms,
            method: 'GET',
            data: {
                api_key: "e2330ecaa641a077ab62520c44ab636f",
                language: "it-IT",
                query: inputSearch.val()
            },
            success: function(res) {

                // conservo i risultati in una variabile
                var searchResults = res.results;

                // controllo che effettivamente io abbia in risposta dei risultati
                if(searchResults.length != 0) {

                    for (var i = 0; i < searchResults.length; i++) {
                        
                        var thisResult = searchResults[i];
                        var summaryStr = thisResult.overview;
                        
                        // imposto dati template
                        var context = {
                            posterUrl: posterImg(thisResult, posterBaseUrl, posterSizes),
                            title: thisResult.title,
                            originalTitle: thisResult.original_title,
                            language: flags(thisResult.original_language),
                            average: stars(starAverage, thisResult, searchResults),
                            type: 'Film',
                            summary: summaryStr.substr(0, 200) + "..."
                        }                      
                        
                        //compilare e aggiungere template
                        var htmlMovie = template(context);
                        sectionFilms.append(htmlMovie);

                    } 

                } else {
                    reset(sectionFilms, sectionSeries);
                    sectionFilms.append('No results in Film');
                    inputSearch.select();
                }
                
            },
                
            error: function() {
                console.log('Errore chiamata'); 
            }
        });
    } else {
        reset(sectionFilms, sectionSeries);
        sectionResults.append('Errore, inserire un valore nella ricerca')
        inputSearch.focus();
    }


    // SERIE TV - ricerca dell'utente / gestisce chiamata API SerieTV
    if(inputSearch.val() != '') {
      
        // chiamata api con query in input
        $.ajax({
            url: apiTv,
            method: 'GET',
            data: {
                api_key: "e2330ecaa641a077ab62520c44ab636f",
                language: "it-IT",
                query: inputSearch.val()
            },
            success: function(res) {

                // conservo i risultati in una variabile
                var searchResults = res.results;

                // controllo che effettivamente io abbia in risposta dei risultati
                if(searchResults.length != 0) {

                    for (var i = 0; i < searchResults.length; i++) {
                        var thisResult = searchResults[i];
                        var summaryStr = thisResult.overview;

                        // imposto dati template
                        var context = {
                            posterUrl: posterImg(thisResult, posterBaseUrl, posterSizes),
                            title: thisResult.name,
                            originalTitle: thisResult.original_name,
                            language: flags(thisResult.original_language),
                            average: stars(starAverage, thisResult, searchResults),
                            type: 'TV-Series',
                            summary: summaryStr.substr(0, 200) + "..."
                        }

                        //compilare e aggiungere template
                        var htmlMovie = template(context);
                        sectionSeries.append(htmlMovie);

                    } 

                } else {
                    sectionSeries.append('No results in TV-Series');
                    inputSearch.select();
                }



            },

            error: function() {
                console.log('Errore chiamata'); 
            }
        });
    } else {
      sectionResults.append('Errore, inserire un valore nella ricerca')
      inputSearch.focus();
    };
    
};

// Funzione per gestire la visualizzazione dei poster
function posterImg(thisResult, posterBaseUrl, posterSizes) {
    if(thisResult.poster_path == null) {
        thisResult.poster_path = 'assets/img/no_poster_img.jpg'
        return thisResult.poster_path
    }
    thisResult.poster_path = posterBaseUrl + posterSizes + thisResult.poster_path
    return thisResult.poster_path

}


function stars(starAverage, thisResult, searchResults) {
     // Assegno ad una varibile il voto in numero intero (arrotondato per eccesso)
     var intVote = Math.ceil(thisResult.vote_average)
                        
     // Switch per assegnare un numero da 1 a 5 al voto
     switch(intVote) {
         case 0: 
             intVote = 0;
             break;
         case 1:
         case 2:
             intVote = 1;
             break;
         case 3:
         case 4:
             intVote = 2;
             break;
         case 5:
         case 6:
             intVote = 3;
             break;
         case 7:
         case 8:
             intVote = 4;
             break;
         case 9:
         case 10:
             intVote = 5;  
             break;
     }
     
     // Assegno il numero corrispondente di stelle piene
     var star = intVote;
     // Calcolo e assegno il numero corrispondente di stelle vuote
     var emptyStar = 5 - intVote;
     
     // Inizializzo variabile stringa
     var starAverage = '';

     // ciclo per concatenare le stelle piene
     for( var starCount = 1; starCount <= star; starCount++) {
         starAverage += '<i class="fas fa-star"></i>';
     }
     
     // ciclo per concatenare le stelle vuote
     for( var emptyStarCount = 1; emptyStarCount <= emptyStar; emptyStarCount++){
         starAverage += '<i class="far fa-star"></i>';
     }  
     return starAverage;
}

function flags(thisResult) {
    flagArray = [
        'it',
        'en'
    ]

    for (var i = 0; i < flagArray.length; i++) {
        var ciao = flagArray[i]
        if(thisResult == ciao) {
            return '<img src="assets/img/' + ciao + '.svg" class="flags"'
        };  
    };

    return thisResult;  
};

// funzione Reset DOM container
function reset(containerFilms, containerSeries) {  
    containerFilms.html('');
    containerSeries.html('');
};