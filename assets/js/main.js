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
    var searchBtn = $('.search-section i');
    var homeBtn = $('.home-btn');
    var inputSearch = $('.main-header input#search');
    var sectionFilms = $('.main .main_result-search #films');
    var sectionSeries = $('.main .main_result-search #series');

    
    // Init Handlebars
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);
    
    // trending film e tv-series
    trending(sectionFilms, sectionSeries, template);

    homeBtn.click( function() {
        // Aggiungo trending a nome sezione
        $('.main_result-search span.trending').text('Trending');

        //reset containers
        reset(sectionFilms, sectionSeries);
        
        // trending film e tv-series
        trending(sectionFilms, sectionSeries, template);
    });

    // Show and Hide Input Field
    searchBtn.click( function() {

        // Cambio icona cambiando la classe (fontAwesome)
         searchBtn.toggleClass('fas fa-search');
         searchBtn.toggleClass('fas fa-times');
        
         // Aggiungo classe Active per animazione Show/Hide
         inputSearch.toggleClass('active-searchbar');

         //Focus sull'input
         inputSearch.select();

    });

    // Avvia ricerca con "INVIO" ed ad ogni click sulla SPACEBAR
    inputSearch.keypress(function(event) {
            
            /**
             * L'idea è quella di poter filtrare man mano la ricerca mentre scrivi
             * usando quindi un detect anche sulla spacebar per far partire la ricerca
             */
            if(event.which == 13) {
                search(inputSearch, sectionFilms, sectionSeries, template)
            };

        
    });


 }); // <- End Doc Ready 


/*********************
 *  FUNCTIONS
 *********************/

 // Funzione per printare di default i contenuti più cercati
function trending(sectionFilms, sectionSeries, template) {
    var posterBaseUrl = 'https://image.tmdb.org/t/p/'
    var posterSizes = 'w342';
    var apiTrending = [
        'https://api.themoviedb.org/3/trending/movie/week?api_key=e2330ecaa641a077ab62520c44ab636f',
        'https://api.themoviedb.org/3/trending/tv/week?api_key=e2330ecaa641a077ab62520c44ab636f'
    ];


    for (var i = 0; i < apiTrending.length; i++) {

        thisApi = apiTrending[i]

        // chiamata api con query in input
        $.ajax({
            url: thisApi,
            method: 'GET',
            success: function(res) {

                // conservo i risultati in una variabile
                var results = res.results;
                
                    for (var i = 0; i < results.length; i++) {
     
                        var movie = results[i];
                        if(movie.overview == "") {
                            var summaryStr = 'No description';
                        } else {
                            var summaryStr = movie.overview;
                        }

                        // controllo il type e lo assegno ad una variabile
                        var thisType = '';
                        if (results[i].title != undefined) {
                            thisType = 'Film';     
                        } else {
                            thisType = 'Tv-series';
                        }

                        // imposto dati template
                        var context = {
                            posterUrl: posterImg(movie, posterBaseUrl, posterSizes),
                            title: movie.title || movie.name,
                            originalTitle: movie.original_title || movie.original_name,
                            language: flags(movie.original_language),
                            type: thisType,
                            summary: setOverview(movie.overview)
                        }                      
                        
                        //compilare e aggiungere template
                        var htmlMovie = template(context);

                        // Controlo per determinare in quale sezione appendere il singolo risultato
                        if(thisType == 'Film') {
                            sectionFilms.append(htmlMovie);
                        } else {
                            sectionSeries.append(htmlMovie)
                        }
                    } 
    
            },
                
            error: function() {
                console.log('Errore chiamata'); 
            }
        });

        
    }
}

//Funzione per la ricerca dell'utente / Con reset iniziale
function search(inputSearch, sectionFilms, sectionSeries, template, starAverage) {

    // Imposto placeholder
    inputSearch.attr('placeholder', 'Search');

    // Elimino Trending da nome sezione
    $('.main_result-search span.trending').text('');

    // reset contenuti main
    reset(sectionFilms, sectionSeries);

    var posterBaseUrl = 'https://image.tmdb.org/t/p/'
    var posterSizes = 'w342';
    var api = [
            'https://api.themoviedb.org/3/search/movie',
            'https://api.themoviedb.org/3/search/tv',
    ];

    for (var b = 0; b < api.length; b++) {
        var thisApi = api[b];   

        var dataApi = {
            url: thisApi,
            api_key: "e2330ecaa641a077ab62520c44ab636f",
            language: "it-IT",
            query: inputSearch.val()
        }

        if(dataApi.query != '') {
            // chiamata api con query in input
            $.ajax({
                url: dataApi.url,
                method: 'GET',
                data: {
                    api_key: dataApi.api_key,
                    language: dataApi.language,
                    query: dataApi.query
                },
                success: function(res) {

                    // conservo i risultati in una variabile
                    var searchResults = res.results;
                    
                    // controllo che effettivamente io abbia in risposta dei risultati
                    if(searchResults.length != 0) {
                        for (var i = 0; i < searchResults.length; i++) {

                            var movie = searchResults[i];

                            // controllo il type e lo assegno ad una variabile
                            var thisType = '';
                            if (searchResults[i].title != undefined) {
                                thisType = 'Film';   
                            } else {
                                thisType = 'Tv-series';
                            }

                            // imposto dati template
                            var context = {
                                posterUrl: posterImg(movie, posterBaseUrl, posterSizes),
                                title: movie.title || movie.name,
                                originalTitle: movie.original_title || movie.original_name,
                                language: flags(movie.original_language),
                                average: stars(starAverage, movie, searchResults),
                                type: thisType,
                                summary: setOverview(movie.overview)
                            }                      
                            
                            //compilare e aggiungere template
                            var htmlMovie = template(context);

                            // Controlo per determinare in quale sezione appendere il singolo risultato
                            if(thisType == 'Film') {
                                sectionFilms.append(htmlMovie);
                            } else {
                                sectionSeries.append(htmlMovie)
                            }
                            
    
                        } 
    
                    } else {
                        if (ciao == 'https://api.themoviedb.org/3/search/tv') {
                            sectionSeries.text('No results in Tv-series')
                        } else if (ciao == 'https://api.themoviedb.org/3/search/movie') {
                            sectionFilms.text('No results in Films')
                        } 
                        
                        console.log('devo trovare il modo');
                        inputSearch.select();
                    }
                    
                },
                    
                error: function() {
                    console.log('Errore chiamata'); 
                }
            });
        } else {
            inputSearch.attr('placeholder', 'Errore, inserire un valore nella ricerca');
            inputSearch.focus();
        }

    }

    
};

// Funzione per gestire la visualizzazione dei poster
function posterImg(movie, posterBaseUrl, posterSizes) {
    if(movie.poster_path == null) {
        movie.poster_path = 'assets/img/no_poster_img.jpg'
        return movie.poster_path
    }
    movie.poster_path = posterBaseUrl + posterSizes + movie.poster_path
    return movie.poster_path

}


function stars(starAverage, movie) {
     // Assegno ad una varibile il voto in numero intero (arrotondato per eccesso)
     var intVote = Math.ceil(movie.vote_average)
                        
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

function flags(movie) {
    flagArray = [
        'it',
        'en'
    ]

    for (var i = 0; i < flagArray.length; i++) {
        var ciao = flagArray[i]
        if(movie == ciao) {
            return '<img src="assets/img/' + ciao + '.svg" class="flags"'
        };  
    };

    return movie;  
};

function setOverview(movie) {
    if(movie == "") {
        var overview = 'No description.';
    } else {
        var summaryStr = movie;
        var overview = summaryStr.substr(0, 200) + "...";
    };

    return overview;
}

// funzione Reset DOM container
function reset(containerFilms, containerSeries) {  
    containerFilms.html('');
    containerSeries.html('');
};