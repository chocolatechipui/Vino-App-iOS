$(function () {

  //////////////////////////////////////////
  // Initialization
  // Check for larger iPhones (6 and 6 Plus)
  //////////////////////////////////////////
  var isiPhone6Plus = false;
  var isiPhone6 = false;
  if ($.isiOS && window.innerWidth >= 414) isiPhone6Plus = true;
  if ($.isiOS && window.innerWidth === 375) isiPhone6 = true;
  if (!$.isStandalone) $('body').addClass('inBrowserMode');
  if (!$.isiOS && window.innerWidth >= 414) isiPhone6Plus = true;
  if (!$.isiOS && window.innerWidth >= 320 && window.innerWidth < 414) isiPhone6 = true;



  /////////
  // Views
  /////////

  // Define templates
  //=================

  // Top Picks (Red & White):
  //=========================
  // Get template from script tag:
  var topPicksTmpl = $('#topPicksTemplate').html();

  // Parse the template string and use "wine" variable:
  var parsedTopPicks = $.template(topPicksTmpl, 'wine');

  // Subscribe to 'wine-top-picks' publication.
  // This will send the top picks of red and white
  // wines through and Ajax request in the Model section.
  //=====================================================
  var bestRedWines = $.subscribe('wine-top-picks', function(event, wines) {
    // Append rendered items to red picks list:
    wines[0].forEach(function(wine) {
      $('#picksRed').append(parsedTopPicks(wine));
    });
    // Append rendered items to white picks list:
    wines[1].forEach(function(wine) {
      $('#picksWhite').append(parsedTopPicks(wine));
    });
  });


  // Selected Wine Template:
  //========================
  // Get template from script tag:
  var selectedWineTmpl = $('#selectedWineTemplate').html();
  // Parse the template string and use "wine" variable:
  var parsedSelectedWine = $.template(selectedWineTmpl, 'wine');

  // About This App Template:
  //=========================
  var aboutContent = $('#aboutContent').html();


    // Parts for search sheet.
    // Different content for different 
    // iPhone & iPad sizes:
    //================================

    // All phones get search nav:
    var searchNavBar = $('#searchNavBarTemplate').html();

    // For iPhone 6 Plus:
    var searchiPhone6Type = $('#searchiPhone6TypeTemplate').html();

    // For iPhone 6 Plus:
    var searchiPhone6PlusBody = $('#searchiPhone6PlusBody').html();

    // For iPhone 6:
    var searchiPhone6Body = $('#searchiPhone6Body').html();

    // For all iPhones and Web:
    // Define data-model on label and
    // data-controller on range input
    // to enable automatic data binding.
    var priceSelector = $('#priceSelector').html();

    // For Web and iPhone 5S and earlier:
    var searchPanel = $('#searchPanel').html();

    var searchResultsTmpl = $('#searchResultsTemplate').html();
    var parsedSearchResults = $.template(searchResultsTmpl, 'wine');

    // Render templates that will show
    // parameters for search results:
    var searchParameteresTemplate = $('#searchParameteresTemplate').html();
    $('#searchParameters').html(searchParameteresTemplate);
    $('#searchParameters-no-match').html(searchParameteresTemplate);

    // Purchase Sheet Template:
    var purchaseSheetTemplate = $('#purchaseSheetTemplate').html();

    // About Sheet Handle Template:
    var aboutSheetHandleTemplate = $('#aboutSheetTemplate').html();



  
  //////////
  // Models
  //////////

  /* Since this is only a reference app, we are not
  setting up all the models you would need for a 
  complete app. Missing in action: shopping cart, 
  purchase object, purchase receipt, etc. Based on
  how you would handle any transaction, you would need
  to create the necessary objects along with their
  validation and business logic here. */


    // Get the JSON for top picks of red and white wines:
    var bestReds = bestWines[0].data;
    var bestWhites = bestWines[1].data;

    // Publish the results to notify
    // any template subscribers that
    // the data is available:
    $.publish('wine-top-picks', [bestReds, bestWhites]);



  // Set up inital values for search parameters.
  //============================================
  var searchParameters = {
    "type": "Red",
    "body": "Medium",
    "price": 20
  };




  //////////////
  // Controllers
  //////////////

  // Define handler to randomize images:
  //////////////////////////////////////
  var randomizeImage = function() {
    var rand = Math.floor(Math.random()*69) + 1;
    if (this.randNumber === rand) {
      return Math.floor(Math.random()*69) + 1;
    } else {
      this.randNumber = rand;
      return rand;
    }
  };

  // Define method to output hero image:
  //====================================

  var outputHeroImg = function() {
    // Set random image on page:
    var imagePath = "./images/barrels/img-";
    if (window.innerWidth > 767) imagePath = "./images/barrels-ipad/img-";
    $('.hero').css('background-image', 'url(' + imagePath + randomizeImage() + '.jpg)');
  };



  /////////////////////////////////////
  // Define Mediators and Subscribers 
  // for Top Pics Wines on Main Screen:
  /////////////////////////////////////

  // Define handler to get wine from 
  // main screen wine carousels
  // when user taps a wine square:
  //=================================
  $('.horizontal-scroll-panel').on('singletap', 'li', function() {
    var wine = $(this).attr('data-id');

    // Filter the choice from the wines object:
    var tappedWine = wines.filter(function(item) {
      return item.id === wine;
    });

    // Publish the selected wine:
    $.publish('top-pick-selected-wine', tappedWine[0]);
  }); 

  // Define Mediator to output chosen wine:
  //=======================================
  var TopPicsMediator = $.subscribe('top-pick-selected-wine', function(event, wine) {
    renderSelectedWine(wine);
  });

  // Define method to be used by TopPicsMediator:
  //=============================================
  var renderSelectedWine = function(wine) {
    // console.log(wine.name);
    // Output selected wine template:
    $('#selectedWine ul').html(parsedSelectedWine(wine));

    // Update screen title and list tiles:
    $('#detailNavbar h1').html(wine.type);
    $('#selectedWine h2').html(wine.varietal);

    // Output image to detail hero:
    outputHeroImg();

    // Go to detail view:
    $.UIGoToArticle('#selectedWine');
  };


  ////////////////////////
  // About This App Sheet:
  ////////////////////////

  // Define method to show About info sheet:
  //========================================

  // Initialize about sheet:
  $.UISheet({id:'aboutSheet'});

  // Populate about sheet with content:
  $('#aboutSheet').find('section').html(aboutContent);

  // Add button to close about sheet:
  $('#aboutSheet').find('.handle').html(aboutSheetHandleTemplate);
  
  // Define handler to show about sheet
  // when use taps the info icon button:
  //====================================
  $('#getInfo').on('singletap', function() {
    $.UIShowSheet('#aboutSheet');
  });

  // Define handler to close about sheet:
  //=====================================
  $('#aboutSheet button').on('singletap', function() {
    $.UIHideSheet();
  });


  ////////////////////////////
  // Define methods for search
  ////////////////////////////

  // Define handler to populate
  // search sheet based on
  // width of device. This should
  // produce optimal sheet for
  // iPhone 5 - 5S, iPone 6 & 6 Plus,
  // iPad and desktop Safari.
  //=================================
  var assembleSearchSheet = function () {
    // For iPhone 6 Plus:
    if (isiPhone6Plus) {
      $('#searchSheet section').html(searchNavBar + searchiPhone6Type + searchiPhone6PlusBody + priceSelector);

      // Initialize select lists:
      $('#wineType').UISelectList({
        selected: 0,
        callback: function() {
          searchParameters.type = $(this).text();
        }
      });

      $('#wineBody').UISelectList({
        selected: 0,
        callback: function() {
          searchParameters.body = $(this).text();
        }
      });

    // For iPhone 6:
    } else if (isiPhone6) {
      $('#searchSheet section').html(searchNavBar + searchiPhone6Type + searchiPhone6Body + priceSelector);

      // Initialize segemented control behavior:
      $('#varietySegmented').UISegmented({
        selected: 1, 
        callback: function() {
          searchParameters.body = $(this).text();
        }
      });

      // Initialize select list:
      $('#wineType').UISelectList({
        selected: 0,
        callback: function() {
          searchParameters.type = $(this).text();
        }
      });

    // For other iPhones:
    } else {
      $('#searchSheet section').html(searchNavBar + searchPanel);

      // Initialize segemented control behavior:
      $('#typeSegmented').UISegmented({
        selected: 0, 
        callback: function() {
          searchParameters.type = $(this).text();
        }
      });

      $('#varietySegmented').UISegmented({
        selected: 1, 
        callback: function() {
          searchParameters.body = $(this).text();
        }
      });
    }
  };

  // Create the search sheet:
  //=========================
  $.UISheet({id:'searchSheet'});

  // Populate search sheet:
  //=======================
  assembleSearchSheet();

  $.UIBindData();

  // Hide search sheet when user taps Cancel:
  //=========================================
  $('#searchSheet').on('singletap', '#cancelSearch', function() {
    $.UIHideSheet();
    // Turn off window resize for price range input:
    window.onresize = null;
  });

  // Method to keep price range input
  // selection slider updated if the
  // browser window width changes:
  var updateRangeInput = function() {
    var input = $('#priceRangeInput');    
    var newPlace;  
    var width = input.width();
    var newPoint = (input.val() - input.attr("min")) / (input.attr("max") - input.attr("min"));
    var offset = -1.3;
    if (newPoint < 0) { 
      newPlace = 0; 
    } else if (newPoint > 1) { 
      newPlace = width; 
    } else { 
      newPlace = width * newPoint + offset; offset -= newPoint; 
    }
    input.css({'background-size': Math.round(newPlace) + 'px 10px'});
  };

  // Update price range input when window is resized:
  window.onresize = updateRangeInput;

  // Define handler for filtering wines:
  //====================================
  $('#search').on('singletap', function() {
    $('#searchSheet').css('height','100%');
    $.UIShowSheet('#searchSheet');
    // Update price range input
    // in case window was resized:
    updateRangeInput();
  });

  ////////////////////////////////
  // Methods for price range input
  // in search sheet:
  ////////////////////////////////

  // Show initial value of price range input:
  //=========================================
  $('#priceRangeOutput > span').html('20');

  // Handle user interaction with price range input.
  // Attach data value to search sheet "search" button.
  // This will enable knowing the price range when the user
  // taps "Search":
  $('#priceRangeInput').on('input', function() {
    searchParameters.price = this.value;
  });

  /////////////////////////////////
  // Define handler to filter wines 
  // based on user choice:
  /////////////////////////////////

  // Define Method to show search parameters:
  //=========================================

  // Symbol for parameter output:
  var selectionParameters = $('#selectionParameters');

  // Handler to show chosen parameters for wine search:
  var showChosenSearchParameters = function(element, parameters) {
    if (!parameters) return;
    element.find('.type').html(parameters.type);
    element.find('.body').html(parameters.body);
    element.find('.price').html('$' + parameters.price);
  };

  // Symbol for search results output:
  var filteredWinesList = $('#filteredWines');

  // Event listener to search for wines:
  $('#searchSheet').on('singletap', '#startSearch', function() {
    // Filter wines based on user choices.
    // These are stored on searchParameters object:
    var filteredWines = wines.filter(function(wine) {
      return wine.type === searchParameters.type && wine.body === searchParameters.body && parseInt(wine.price.split('$')[1],10) <= searchParameters.price;
    });

    // Close the search sheet:
    $.UIHideSheet();

    // Turn off window resize for price range input:
    window.onresize = null;

    // Handle no match with chosen parameters:
    //========================================
    if (filteredWines.length === 0) {
      $.UIGoToArticle('#noMatch');

      // Show search parameters:
      showChosenSearchParameters($('#searchParameters-no-match'), searchParameters);

    // Otherwise, show results,
    // and update templates:
    //=========================
    } else {
      // Go to wine list and show results:
      $.UIGoToArticle('#wineList');

      // Show search parameters:
      showChosenSearchParameters($('#searchParameters'), searchParameters);

      // Clear any existing results from list:
      filteredWinesList.empty();

      // Render search results:
      filteredWines.forEach(function(wine) {
        filteredWinesList.append(parsedSearchResults(wine))
      });
    }
  });


  ////////////////////////////////////////
  // Show detail for tapped search results
  ////////////////////////////////////////

  // Register handler to capture which wine
  // the user tapped and then show its detail:
  //==========================================
  $('#filteredWines').on('singletap', 'li', function() {

    // Get id of tapped wine:
    var id = $(this).attr('data-id');

    // Method to filter wines by chosen wine id:
    var selection = wines.filter(function(wine) {
      return wine.id === id;
    });

    // Update detail template:
    $.publish('top-pick-selected-wine', selection[0]);
    $.UIGoToArticle('#selectedWine');
  });


  //////////////////////////////////////////////
  // Define methods to show winery in Apple Maps
  //////////////////////////////////////////////

  // Define Mediator to get winery location.
  // This is captured when the user taps
  // the Visit button on wine detail page.
  //========================================
  var WineryLocationMediator = $.subscribe('top-pick-selected-wine', function(event, winery) {
    $('#viewWinery').attr('data-location', winery.location);
  });

  // Define method to show winery in Apple Maps:
  //============================================
  var renderWineryMap = function(location) {
//    window.location.href= 'http://maps.apple.com/?q=' + location;
  window.location.href= 'maps://?q=' + location;
  };

  // Define event handler to show 
  // winery in Apple Maps:
  //=============================
  $('#viewWinery').on('singletap', function() {
    var location = $(this).attr('data-location')
    renderWineryMap(location);
  });

  ///////////////////
  // Purhase Workflow
  ///////////////////

  // Initialize purchase sheet:
  //===========================
  $.UISheet({id:'purchaseSheet'});
  
  // Populate purchase sheet
  $('#purchaseSheet').find('section').html(purchaseSheetTemplate);

  // Make purchase of wine:
  //=======================
  var progress = $('progress');
  var pval = 0;
  var progressInterval;

  // Define method for purchase process.
  // This will animate the progress bar:
  //====================================
  var processProgress = function() {
    if (pval === 500) {
      // Make sure we are starting clean:
      clearInterval(progressInterval);

      // Show the progress panel:
      $('#progressPanel').toggle();

      // Hide the confirmation panel:
      $('#confirmationPanel').toggle();
      $('#purchaseSheet').css('height', 200);

      // Set inital value for progress animation:
      pval = 0;
    } else {
      // Increate the value for animation:
      pval++;

      // Update the progress bar with new value:
      progress.val(pval);
    }
  };

  // Define handler to display purchase sheet:
  //==========================================
  $('#confirmationPanel button').on('singletap', function() {
    $.UIHideSheet();


    $('#confirmationPanel').hide();

    $('#purchaseSheet').css('height', 80);

    // Delay showing the progress bar so
    // it doesn't show while hiding the sheet:
    setTimeout(function() {
      $('#progressPanel').show();
    }, 200);
  }) 

  ////////////////////////////////
  // Define event handler to begin 
  // purchase process:
  ////////////////////////////////

  // Enable showing purchase sheet for 
  // purchase completion. This will
  // open a popup dialog, offering the
  // user the chance to cancel to
  // purchase the chosen wine.
  //=================================== 
  $('#selectedWine').on('singletap', '.counter', function(e) {
    var wine = $(this).parent().prev().find('h3').text();
    var price = $(this).text();
    $.UIPopup({
      id: "purchasePopup",
      message: 'Do you want to purchase ' + wine + ' for ' + price, 
      cancelButton: 'Cancel',
      continueButton: 'Purchase',
      callback: function() {
        setTimeout(function() {
          $.UIShowSheet('#purchaseSheet');
          progressInterval = setInterval(processProgress, pval);
        });
      }
    });
  });

});