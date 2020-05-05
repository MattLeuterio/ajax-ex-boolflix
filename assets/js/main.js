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
    var btnSearch = $('.main-header button.btn-search');
    var sectionResults = $('.main .main_result-search');
    
    // Init Handlebars
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);

    // Avvia ricerca con bottone "Search"
    btnSearch.click( function() {
        
        // FILM Chiamata Api e stampo risultati
        searchMovies(inputSearch, sectionResults, apiFilms, template);

        // SERIETV Chiamata Api e stampo risu ltati
        searchTV(inputSearch, sectionResults, apiSeries, template);
        
    });

    // Avvia ricerca con "INVIO" ed ad ogni click sulla SPACEBAR
    inputSearch.keyup(function(event) {
            
            /**
             * L'idea è quella di poter filtrare man mano la ricerca mentre scrivi
             * usando quindi 
             */
            if(event.which == 13 || event.which == 32) {
                // FILM Chiamata Api e stampo risultati
                searchMovies(inputSearch, sectionResults, apiFilms, template);
                
                // SERIETV Chiamata Api e stampo risu ltati
                searchTV(inputSearch, sectionResults, apiSeries, template);
            };
        
    });

    




 }); // <- End Doc Ready 

/*********************
 *  FUNCTIONS
 *********************/

 // FILM - funzione per la ricerca dell'utente / gestisce anche chiamata API
 function searchMovies(inputSearch, sectionResults, api, template) {
    if(inputSearch.val() != '') {

        // pulisco sezione risultati per inserire nuovi dati
        reset(sectionResults);

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
                            language: flags(thisResult),
                            average: thisResult.vote_average,
                            type: 'Film'
                        }

                        console.log(thisResult.original_language);
                        

                        //compilare e aggiungere template
                        var htmlMovie = template(context);
                        sectionResults.append(htmlMovie);

                    } 

                } else {
                    reset(sectionResults);
                    sectionResults.append('Nessun Risultato in Film');
                    inputSearch.select();
                }
                


            },
                
            error: function() {
                console.log('Errore chiamata'); 
            }
        });
    } else {
        reset(sectionResults);
        sectionResults.append('Errore, inserire un valore nella ricerca')
        inputSearch.focus();
    }
 };

// SERIE TV - funzione per la ricerca dell'utente / gestisce anche chiamata API
 function searchTV(inputSearch, sectionResults, api, template) {
  if(inputSearch.val() != '') {

      // pulisco sezione risultati per inserire nuovi dati
     // reset(sectionResults);

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
                          title: thisResult.name,
                          originalTitle: thisResult.original_name,
                          language: flags(thisResult),
                          average: thisResult.vote_average,
                          type: 'TV'
                      }

                      //compilare e aggiungere template
                      var htmlMovie = template(context);
                      sectionResults.append(htmlMovie);

                  } 

              } else {
                  reset(sectionResults);
                  sectionResults.append('Nessun Risultato in TV');
                  inputSearch.select();
              }
              


          },
              
          error: function() {
              console.log('Errore chiamata'); 
          }
      });
  } else {
      reset(sectionResults);
      sectionResults.append('Errore, inserire un valore nella ricerca')
      inputSearch.focus();
  };

};

function flags(thisResult) {
    if(thisResult.original_language === 'it') {
        return '<img src="assets/img/it.svg" alt="italian-flag">'
        
        

    } else if (thisResult.original_language === 'en'){
        return '<img src="assets/img/en.svg" alt="italian-flag">'
    } else {
        return thisResult.original_language;
    }
}

// funzione Reset DOM container
function reset(container) {  
    container.html('');
};      