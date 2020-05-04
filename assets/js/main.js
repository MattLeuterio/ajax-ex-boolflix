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
    var api = 'https://api.themoviedb.org/3/search/movie';
    var inputSearch = $('.main-header input#search');
    var btnSearch = $('.main-header button.btn-search');
    var sectionResults = $('.main .main_result-search');
    
    // Init Handlebars
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);

    // Avvia ricerca con bottone "Search"
    btnSearch.click( function() {
        
        // Chiamata Api e stampo risultati
        searchMovies(inputSearch, sectionResults, api, template);
        
    });

    // Avvia ricerca con "INVIO" ed ad ogni click sulla SPACEBAR
    inputSearch.keyup(function(event) {
            
            /**
             * L'idea è quella di poter filtrare man mano la ricerca mentre scrivi
             * usando quindi 
             */
            if(event.which == 13 || event.which == 32) {
                searchMovies(inputSearch, sectionResults, api, template);
            };

    });

    




 }); // <- End Doc Ready 

/*********************
 *  FUNCTIONS
 *********************/

 function searchMovies(inputSearch, sectionResults, api, template) {
    if(inputSearch.val() != '') {

        // pulisco sezione risultati per inserire nuovi dati
        sectionResults.html('');

        // chiamata api con query in input
        $.ajax({
            url: api,
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
                        
                        // imposto dati template
                        var context = {
                            title: thisResult.title,
                            originalTitle: thisResult.original_title,
                            language: thisResult.original_language,
                            average: thisResult.vote_average
                        }

                        //compilare e aggiungere template
                        var htmlMovie = template(context);
                        sectionResults.append(htmlMovie);

                    } 

                } else {
                    
                    sectionResults.append('Nessun Risultato');
                    
                }
                


            },
                
            error: function() {
                console.log('Errore chiamata festività'); 
            }
        });
    }
 }
