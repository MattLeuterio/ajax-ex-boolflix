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
    var sectionPeople = $('.main .main_result-search #people')
    var sectionFilms = $('.main .main_result-search #films');
    var sectionSeries = $('.main .main_result-search #series');
    var sectionJumbotron = $('.jumbotron');


    // Init Handlebars - Movie
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);
    
    // Init Handlebars - People
    var sourcePeople = $('#people-template').html();
    var templatePeople = Handlebars.compile(sourcePeople);

    // Init Handlebars - Jumbotron
    var sourceJumbo = $('#jumbotron-template').html();
    var templateJumbotron = Handlebars.compile(sourceJumbo);

    // jumbotron
    jumbotron(sectionJumbotron, templateJumbotron)

    $('.jumbotron').on('click', '.btn_trailer', function() {
        console.log('click');
        
        $('.iframe-container').toggle()
    });


    // top ten people week
    people10(sectionPeople, templatePeople)

    $('body').on('click', '.movie', function() {

        //refs da dove prendere i dati
        var poster = $(this).children('.poster').children('img').clone();
        var format = $(this).find('.movie__format').text()
        var title = $(this).find('.movie__title').text()
        var language = $(this).find('.movie__language').html()
        var average = $(this).find('.movie__average').html()
        var summary = $(this).find('.summary').text()
        
        // printo dati
        $('.info-movie__left_cover').html(poster);
        $('.detail__format').text(format);
        $('.detail__title').text(title);
        $('.detail__language').html(language);
        $('.detail__average').html(average);
        $('.detail__summary').text(summary);
 
        //Show section
        $('.disable-body').show();
        $('.info-movie').show();
    });

    //Chiudi panel info movie con icona
    $('.close').click( function() {
        //Hide section
        $('.disable-body').hide();
        $('.info-movie').hide();
    });
    
    //Chiudi panel info movie cliccando sul finto body
    $('.disable-body').click( function() {
        //Hide section
        $('.disable-body').hide();
        $('.info-movie').hide();
    });


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

        

            if(event.which == 13) {
                // scroll alla posizione dei risultati
                $('#wrapper-films').scrollTop()
                //Funzione per la ricerca e la stampa
                search(inputSearch, sectionFilms, sectionSeries, template)
            };

        
    });


 }); // <- End Doc Ready 


/*********************
 *  FUNCTIONS
 *********************/

//Funzione per template Jumbotron
function jumbotron(sectionJumbotron, templateJumbotron) {
    //Jumbotron 
    var jumboFilms = [
        {
            title: "Inception",
            format: "Film",
            link_trailer: "8hP9D6kZseM",
            link_image: "inception.jpg",
            summary: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
        },
        {
            title: "Narcos: Mexico",
            format: "Tv-Series",
            link_trailer: "eHdRMOAT-Lc",
            link_image: "bg-narcos.webp",
            summary: "Narcos: Mexico explores the origin of the modern war on drugs, beginning at the time when Mexican traffickers were a loose and disorganized confederation of small-time independent cannabis growers and dealers."
        },
        {
            title: "Star Wars: Episode IX - The Rise of Skywalker",
            format: "Film",
            link_trailer: "8Qn_spdM5Zg",
            link_image: "starwars.jpg",
            summary: "The surviving members of the resistance face the First Order once again, and the legendary conflict between the Jedi and the Sith reaches its peak bringing the Skywalker saga to its end."
        }

    ];

    var randomNum = getRandomInt(0, 2);

    // imposto dati template
    var contextJumbo = {
        format: jumboFilms[randomNum].format,
        title: jumboFilms[randomNum].title,
        summary: jumboFilms[randomNum].summary,
        linkTrailer: jumboFilms[randomNum].link_trailer,
        linkImage: jumboFilms[randomNum].link_image
    };                      
    
    //compilare e aggiungere template
    var htmlJumbo = templateJumbotron(contextJumbo);
    sectionJumbotron.append(htmlJumbo);   
};

// Funzione per printare top ten people
function people10(sectionPeople, templatePeople) {
    // chiamata api con query in input
    $.ajax({
        url: 'https://api.themoviedb.org/3/trending/person/week?api_key=e2330ecaa641a077ab62520c44ab636f',
        method: 'GET',
        success: function(res) {
            
            // Variabili per immagine
            var posterBaseUrl = 'https://image.tmdb.org/t/p/'
            var posterSizes = 'w185';
            
            // conservo i risultati in una variabile
            var results = res.results;
            
                for (var i = 0; i < 10; i++) {
 
                    var people = results[i];

                    // imposto dati template
                    var context = {
                        imagePeopleUrl: posterBaseUrl + posterSizes + people.profile_path,
                        namePeople: people.name,
                        rolePeople: people.known_for_department,
                    }                      
                    
                    //compilare e aggiungere template
                    var htmlPeople = templatePeople(context);
                    sectionPeople.append(htmlPeople);            
                } 

        },
            
        error: function() {
            console.log('Errore chiamata'); 
        }
    });
};

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
};

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
    
                    }  else {
                        console.log(this.url);
                        if (this.url.includes('search/movie')) {
                            sectionFilms.text('No results in Films')
                        }
                        if (this.url.includes('search/tv')) {
                            sectionSeries.text('No results in Tv-series')
                        } 
                        // console.log('devo trovare il modo');
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

};

// Trasforma la valutazione numerica in stelle da 1 a 5
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
};

// Gestisce le icone della lingua
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

// Funzione per gestire le descrizioni dei film
function setOverview(movie) {
    if(movie == "") {
        var overview = 'No description.';
    } else {
        var summaryStr = movie;
        var overview = summaryStr.substr(0, 200) + "...";
    };

    return overview;
};

// funzione Reset DOM container
function reset(containerFilms, containerSeries) {  
    containerFilms.html('');
    containerSeries.html('');
};

// Restituisce numero random in un range 

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso 
};

