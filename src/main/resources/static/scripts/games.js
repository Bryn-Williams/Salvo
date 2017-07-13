$(document).ready(function(){

  var x = getURL();


  $.getJSON("http://localhost:8080/api/game_view/" + x, function (bigData) {
        //CALL THE FUNCTIONS HERE
        var theData = bigData;

        createTheGrid();
        createSalvoGrid();

        fillLeftGrid(x, theData);
        placeFirstRoundOfSalvoes(x,theData);

  });
});

    function getURL() {

          var theUrl = location.search;
          var xx = paramObj(theUrl);

          return xx;
      };

    function paramObj(search) {
          var obj = {};
          var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

          search.replace(reg, function (match, param, val) {
              obj[decodeURIComponent(param)] = val === undefined ? "" : decodeURIComponent(val);
          });

          obj = obj.gp;
          return obj;
      }

    function createTheGrid() {

        var theLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        var theNumbers = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        var theDiv = $("#divForGrid"); //GETTING THE DIV

        theDiv.append("<div class='flex'><h2 class='blackFont'>Your Fleet!</h2></div>");

        for (var i = 0; i < 11; i++) {

            var row = $("<div class='mainrow'></div>");
            var tiles = $("<div class='numbertiles'></div>");
            var spanny = $("<span></span>");

            spanny.append(theNumbers[i]);
            tiles.append(spanny);
            row.append(tiles);

            for (var x = 0; x < 10; x++) {

                var tiles = $("<div class='tiles'></div>");
                var lettertiles = $("<div class='lettertiles'></div>");

                if (i == 0) {
                    lettertiles.append(theLetters[x]);
                    row.append(lettertiles);
                } else {

                    tiles.attr("id", theLetters[x] + i);
                    row.append(tiles)
                }
            }
            theDiv.append(row);
        };
    };

    function createSalvoGrid() {

        var theLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        var theNumbers = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

        var theDiv = $("#divForSalvoes"); //GETTING THE DIV
        theDiv.append("<div class='flex'><h2 class='blackFont'>Your Shots!</h2></div>");

        for (var i = 0; i < 11; i++) {

            var row = $("<div class='mainrow'></div>");
            var tiles = $("<div class='numbertiles'></div>");
            var spanny = $("<span></span>");

            spanny.append(theNumbers[i]);
            tiles.append(spanny);
            row.append(tiles);

            for (var x = 0; x < 10; x++) {

                var tiles = $("<div class='salvotiles'></div>");
                var lettertiles = $("<div class='lettertiles'></div>");

                if (i == 0) {
                    lettertiles.append(theLetters[x]);
                    row.append(lettertiles);
                } else {

                    tiles.attr("id", theLetters[x] + i + theLetters[x] + i);
                    row.append(tiles)
                }
            }
            theDiv.append(row);
        };
    };

    //GET LIST OF SHIP LOCATIONS
    function fillLeftGrid(x, theData) {

            var salvoData = theData;
            var shipLocation = salvoData.ships;

            //GET PLAYER ONE'S SHIPS & COLOUR IN THE LEFT GRID
            for (var i = 0; i < shipLocation.length; i++) {

                var arrayOfShipLocations = shipLocation[i].location;

                for (var j = 0; j < arrayOfShipLocations.length; j++) {

                    var individualLocation = arrayOfShipLocations[j];

                    $("#" + individualLocation).addClass("blue");
                };
            }
            if(salvoData.salvoes["0"].length != 0){

                     if (salvoData.salvoes["0"]["0"].gamePlayer == x) {

                        var chloesSalvos = salvoData.salvoes["1"];

                     }else {

                        var chloesSalvos = salvoData.salvoes["0"];
                     }

                 fillBackgroundColor(chloesSalvos, x);//ADD CHLOE'S SALVOS TO JACKS GRID TO SEE IF JACK HAS BEEN HIT
                 addGamePlayerInfo(x, salvoData);
             }

            //addGamePlayerInfo(x, salvoData);
    };

    //ADD YOUR SALVOES TO RIGHT GRID
    function fillBackgroundColorOfSalvoGrid(gridLocation, eachTurn, hitsOnYourOpponent) {

                //console.log(gridLocation);

                $("#" + gridLocation).css("background-color", "green");
                //$('#' + gridLocation).text("X");

                //ADD TURN NUMBER TO SHOTS FIRED
                var turnNumber = eachTurn;
                $("#" + gridLocation).html("X");

                for(var x = 0; x < hitsOnYourOpponent.length; x++){

                    var currentLocation = hitsOnYourOpponent[x].hitLocation;

                     //CHANGE COLOR OF SQUARE IF U HIT YOUR OPPONENT!
                     //$("#" + currentLocation + currentLocation).css("background-color", "red");
                     //$("#" + currentLocation + currentLocation).html("hit");
                     $("#" + currentLocation + currentLocation).addClass("firePic");

                }
     };

    //GET LIST OF SALVO LOCATIONS
    function getSalvoData(x) {

            $.getJSON("http://localhost:8080/api/game_view/" + x, function (bigData){

            var salvoData = bigData;
            var hitsOnYourOpponent = salvoData.hitsOnYourOpponent;

                //console.log(salvoData);

                if(salvoData.salvoes["0"].length == 0 && salvoData.gamePlayers.length == 2 && x <= salvoData.salvoes["1"]["0"].gamePlayer ){

                   var salvoLocations = salvoData.salvoes[1]["0"].locations;
                    var numberOfSalvoes = salvoData.salvoes[1].length;

                    var chloesSalvos = salvoData.salvoes["0"];
                    var jacksSalvos = salvoData.salvoes["1"];

                    for (var i = 0; i < numberOfSalvoes; i++) {

                        for (var j = 0; j < salvoLocations.length; j++) {

                           var eachSalvo = salvoData.salvoes["1"][i].locations[j];
                           var eachTurn = salvoData.salvoes["1"][i].turn;

                           fillBackgroundColorOfSalvoGrid(eachSalvo, eachTurn, hitsOnYourOpponent);
                        }
                    }
console.log("11");
                    fillHitsOnOpponentTable(hitsOnYourOpponent, salvoData, x);
                    return;
                }

                if(salvoData.salvoes["0"].length >= 1){
                if (salvoData.salvoes["0"]["0"].gamePlayer == x) {

                    var salvoLocations = salvoData.salvoes["0"]["0"].locations;
                    var numberOfSalvoes = salvoData.salvoes["0"].length;

                    //var chloesSalvos = salvoData.salvoes["1"];
                    var jacksSalvos = salvoData.salvoes["0"];

                    for (var i = 0; i < numberOfSalvoes; i++) {

                        for (var j = 0; j < salvoLocations.length; j++) {

                            var eachSalvo = salvoData.salvoes["0"][i].locations[j];
                            var eachTurn = salvoData.salvoes["0"][i].turn;
//console.log("22");
                            fillBackgroundColorOfSalvoGrid(eachSalvo, eachTurn, hitsOnYourOpponent);
                        }

                    }
                    fillHitsOnOpponentTable(hitsOnYourOpponent, salvoData, x);

                } else {

                    var salvoLocations = salvoData.salvoes[1]["0"].locations;
                    var numberOfSalvoes = salvoData.salvoes[1].length;
                    var chloesSalvos = salvoData.salvoes["0"];
                    var jacksSalvos = salvoData.salvoes["1"];

                    for (var i = 0; i < numberOfSalvoes; i++) {

                        for (var j = 0; j < salvoLocations.length; j++) {

                           var eachSalvo = salvoData.salvoes[1][i].locations[j];
                           var eachTurn = salvoData.salvoes[1][i].turn;
console.log("33");
                           fillBackgroundColorOfSalvoGrid(eachSalvo, eachTurn, hitsOnYourOpponent);
                        }
                    }
                    fillHitsOnOpponentTable(hitsOnYourOpponent, salvoData, x);
                }
                }
            });
        };

    //ADDS OPPOSITION SALVOES TO LEFT GRID
    function fillBackgroundColor(chloesSalvos, gpId) {

            var yourShipsHaveBeenHitHere = [];

            if(!chloesSalvos){
                return;
            };

                 for(var i = 0; i < chloesSalvos.length;i++){
                      for(var x = 0; x < chloesSalvos[i].locations.length; x++){

                          var chloeEachSalvo = chloesSalvos[i].locations[x];
                          chloeEachSalvo = chloeEachSalvo.slice(2);

                              if($("#" + chloeEachSalvo).hasClass("blue")){

                               $("#" + chloeEachSalvo).removeClass("blue");
                               $("#" + chloeEachSalvo).addClass("firePic");

                               yourShipsHaveBeenHitHere.push(chloeEachSalvo);

                               }else{
                                    $("#" + chloeEachSalvo).addClass("green");
                                    $('#' + chloeEachSalvo).text("X");
                               }
                      }
                 }
      };

    //FUNCTION TO ADD THE GAMEPLAYER INFO
    function addGamePlayerInfo(x, gpData) {

          var gameInfoDivOne = $("#whoIsPlayingNViewingOne");
          var gameInfoDivTwo = $("#whoIsPlayingNViewingTwo");

          var gpData = gpData.gamePlayers;

          var playerBoxOne = $("<h3 class='playerBox blackFont'></h3>");
          var playerBoxTwo = $("<h3 class='playerBox blackFont'></h3>");

        if(gpData.length == 1){

            var playerNameOne = gpData[0].player;
            playerBoxOne.append(playerNameOne);
            gameInfoDivOne.append(playerBoxOne);
            playerBoxTwo.append("???");
            gameInfoDivTwo.append(playerBoxTwo);

        }else{

                  var playerNameOne = gpData[0].player;
                  playerBoxOne.append(playerNameOne);
                  var playerNameTwo = gpData[1].player;
                  playerBoxTwo.append(playerNameTwo);

                  gameInfoDivOne.append(playerBoxOne);
                  gameInfoDivTwo.append(playerBoxTwo);
        }
      };

    function placeFirstRoundOfSalvoes(gpId, theData) {

    //ADD PLACE FIRST ROUND TITLE
    console.log(theData);
    if((theData.gamePlayers.length == 1 && theData.ships.length == 5) || (theData.salvoes["0"].length == 0 || theData.salvoes["0"].length == 0)){
        $("#playerInfoDiv").empty();
        $("#gameStatusBox").html("<h2 class='center'>FIRE YOUR FIRST ROUND OF SALVOES IN THE GRID BELOW!</h2>");
    }




    //THIS IF GRABS THE OPPOSITION GAMEPLAYER'S GP ID
    if(theData.gamePlayers.length == 2){
        if(theData.gamePlayers["0"].gamePlayer_id == gpId){
            var oppositionGP = theData.gamePlayers["1"].gamePlayer_id;
        }else{
            var oppositionGP = theData.gamePlayers["0"].gamePlayer_id;
        }
    }
    //END OF GRABBING OPPOSITIONS GP ID



console.log (gpId);
console.log(oppositionGP);
            //METHOD TO MAKE SURE PLAYER ONE DOESNT FIRE MORE THAN ONE ROUND OF SALVOES!
            if((theData.salvoes.length == 2) && ( theData.salvoes["0"].length == 0 || theData.salvoes["1"].length == 0 ) ){

                    if(gpId < oppositionGP){

                    //console.log(theData);
                    $("#gameStatusBox").html("<h2 class='center'>PLEASE WAIT FOR OPPONENT TO FIRE THEIR FIRST ROUND OF SALVOES</h2>");

                    $(".salvotiles").off('click');

             setInterval(function() {

                    $.getJSON("http://localhost:8080/api/game_view/" + gpId, function(bigData) {
                    //console.log(bigData);

                        if (bigData.salvoes["0"].length == 1 && bigData.salvoes["1"].length == 1) {
                            console.log("refresh");
                            location.reload();
                            console.log("refresh2");

                        }
                    });
            }, 5000);

                    getSalvoData(gpId);
                    //NEED TO ADD A REFRESH HERE!!!!!!!!!!!!!!!!!!!!!!
                    return;
                    }
            }


            console.log(theData);

            //WORKING OUT TURN NUMBER FOR BOTH PLAYERS
            var theTurnNumber = 1;

            for(var z = 0; z < theData.salvoes["0"].length; z++){

                if(theData.salvoes["0"][z].gamePlayer == gpId){
                    var theTurnNumber = theData.salvoes["0"].length + 1;

                }else{
                    var theTurnNumber = theData.salvoes["1"].length + 1;
                }
            }
            //END OF WORKING OUT TURN NUMBER FOR BOTH PLAYERS

            var firstRoundOfSalvoes = [];

            var shotsFired = {};
            shotsFired.salvoLocation = firstRoundOfSalvoes;
            shotsFired.turnNumber = theTurnNumber;

            $(".salvotiles").click(function () {

                     $(this).css("background-color", "pink");
                     //MAKE SURE USER CAN'T CLICK ON SAME SQUARE AND SAVE THE SAME SALVO LOCATION

                     if(firstRoundOfSalvoes.indexOf(this.id) != -1){
                     //if(firstRoundOfSalvoes.includes(this.id)){
                        alert("CANT PLACE SALVOE ON SAME SQUARE");
                     }else{
                        firstRoundOfSalvoes.push(this.id);
                     }
                     //SEND SALVO ARRAY INFO TO DB IF ALL 5 SHOTS HAVE BEEN PLACED
                     if(firstRoundOfSalvoes.length == 5){

                            var sendTheSalvoes = [];
                            sendTheSalvoes.push(shotsFired);

                            //SEND FIRST SHOTS FIRED TO DB
                            $.ajax({

                                    url: "api/games/players/" + gpId + "/salvos",
                                    type: "POST",
                                    contentType:"application/json",
                                    data: JSON.stringify(sendTheSalvoes),
                                    success: function(){

                                        alert("I think your salvoes have been saved");
                                        location.reload();
                                    },
                                    error: function(){
                                        alert("ERROR");
                                    }
                                })
                     }
            });
        //CALL FUNCTION TO FILL SALVO GRID HERE
        getSalvoData(gpId);
    };


    function fillHitsOnOpponentTable(hitsOnYourOpponent, salvoData, loggedInGP){

            //THE LENGTH OF THESE ARRAYS WILL TELL YOU HOW MANY HITS THERE HAVE BEEN ON THIS SHIP
            var carrierArray = [];
            var battleshipArray = [];
            var patrolBoatArray = [];
            var submarineArray = [];
            var destroyerArray = [];

           for(var x = 0; x < hitsOnYourOpponent.length; x++){

                var shipType = hitsOnYourOpponent[x].shipType;

                switch(shipType){
                    case "carrier":
                        carrierArray.push("carrier");
                        break;
                    case "battleship":
                        battleshipArray.push("battleship");
                        break;
                    case "submarine":
                        submarineArray.push("submarine");
                        break;
                    case "destroyer":
                        destroyerArray.push("destroyer");
                        break;
                    case "patrolboat":
                        patrolBoatArray.push("patrolBoat");
                        break;
                }
           }

          //FILL THE CARRIER SQUARES
          for(var x = 1; x < carrierArray.length + 1; x++){
              $("#car" + x).css("background-color", "red")
          }
          //FILL THE BATTLESHIP SQUARES
          for(var x = 1; x < battleshipArray.length + 1; x++){
              $("#bat" + x).css("background-color", "red")
          }
          //FILL THE SUBMARINE SQUARES
          for(var x = 1; x < submarineArray.length + 1; x++){
              $("#sub" + x).css("background-color", "red")
          }
          //FILL THE DESTROYER SQUARES
          for(var x = 1; x < destroyerArray.length + 1; x++){
              $("#des" + x).css("background-color", "red")
          }
          //FILL THE PATROL BOAT SQUARES
          for(var x = 1; x < patrolBoatArray.length + 1; x++){
              $("#pat" + x).css("background-color", "red")
          }

          changeTurnFunction(salvoData, loggedInGP);
    }

    function changeTurnFunction(salvoData, loggedInGP){

        //FOR LOOP TO GET GAME PLAYERS
        for(var z = 0; z < salvoData.salvoes.length; z++){

                if(salvoData.salvoes[z]["0"].gamePlayer == loggedInGP){

                    var loggedInPlayerSalvoes = salvoData.salvoes["1"];
                    var oppositionPlayerSalvoes = salvoData.salvoes["0"];
                }else{

                    var loggedInPlayerSalvoes = salvoData.salvoes["0"];
                    var oppositionPlayerSalvoes = salvoData.salvoes["1"];
                }
        }

        //BELOW YOU HAVE THE VARS FOR LOGGED IN AND OPPOSITION!
        //console.log(loggedInPlayerSalvoes);
        //console.log(oppositionPlayerSalvoes);

        //IF THERE IS ONLY ONE PLAYER SO FAR, REFRESH PAGE WHEN THERE IS A NEW PLAYER
        if(salvoData.salvoes.length == 1){

            $("#gameStatusBox").html("<h2 class='center'>WAITING FOR PLAYER TO JOIN YOUR GAME</h2>");
            $("#divForHits").hide();
            $(".salvotiles").off('click');

             //THIS WILL REFRESH THE PAGE WHEN AN EXTRA PLAYER JOINS
             setInterval(function() {

                    $.getJSON("http://localhost:8080/api/game_view/" + loggedInGP, function(bigData) {
                    //console.log(bigData);

                        if (bigData.salvoes.length == 2) {
                            console.log("refresh");
                            location.reload();
                            console.log("refresh2");

                        }
                    });
            }, 5000);
        }

        //WE HAVE ADDED "WAITING FOR PLAYER TO JOIN GAME".....now we leave the function and wait
        if(salvoData.gamePlayers.length == 1){
            return;
        }


        var opponentGP = oppositionPlayerSalvoes["0"].gamePlayer;
        console.log(opponentGP);
        //CODE BELOW FOR BOTH PLAYERS TAKING TURNS

             if(loggedInPlayerSalvoes.length == oppositionPlayerSalvoes.length){
             //this means its the turn of gp with lower gpid (lower gp means they are player one)
                    if(loggedInGP > opponentGP){
             console.log("test");

                        $(".salvotiles").off('click');
                        $("#gameStatusBox").html("<h2 class='center'>WAIT FOR OPPONENT TO FIRE!</h2>");

                         setInterval(function() {
                                $.getJSON("http://localhost:8080/api/game_view/" + loggedInGP, function(bigData) {

                                    //possibly change the if below...if(loggedInGp's salvoes != opposition player salvoes)
                                    if (bigData.salvoes["0"].length != bigData.salvoes["1"].length) {
                                        console.log('refresh');
                                        location.reload();
                                    }
                                });
                        }, 5000);

                    }else{
                    $("#gameStatusBox").html("<h2 class='center'>YOUR TURN!</h2>");
                    $(".salvotiles").on('click');

                    }
             }else{//this means it is player two's turn
                    if(loggedInGP > opponentGP){
                        $("#gameStatusBox").html("<h2 class='center'>YOUR TURN!</h2>");
                        $(".salvotiles").on('click');

                    }else{
                        $(".salvotiles").off('click');
                        $("#gameStatusBox").html("<h2 class='center'>WAIT FOR OPPONENT TO FIRE!</h2>");
                         setInterval(function() {
                                $.getJSON("http://localhost:8080/api/game_view/" + loggedInGP, function(bigData) {

                                    //possibly change the if below...if(loggedInGp's salvoes != opposition player salvoes)
                                    if (bigData.salvoes["0"].length == bigData.salvoes["1"].length) {
                                        console.log('refresh');
                                        location.reload();
                                    }
                                });
                        }, 5000);
                    }
             }

        //CALL A FUNCTION TO CHECK IF ALL SHIPS HAVE BEEN HIT!
        isGameOver(salvoData,loggedInPlayerSalvoes, oppositionPlayerSalvoes);

    };

    function isGameOver(salvoData, loggedInPlayerSalvoes, oppositionPlayerSalvoes){

        var hitsOnYouArray = [];

             for(var i = 0; i < oppositionPlayerSalvoes.length;i++){
                   for(var x = 0; x < oppositionPlayerSalvoes[i].locations.length; x++){


                        var chloeEachSalvo = oppositionPlayerSalvoes[i].locations[x];
                        chloeEachSalvo = chloeEachSalvo.slice(2);

                        if($("#" + chloeEachSalvo).hasClass("firePic")){
                           hitsOnYouArray.push(chloeEachSalvo);
                        }
                   }
             }

        var gpId = loggedInPlayerSalvoes["0"].gamePlayer;

        //CHECK TO SEE IF THE NUMBER OF TURNS ARE THE SAME AND SOMEONE HAS HIT ALL 17 POSITIONS
        if((loggedInPlayerSalvoes.length == oppositionPlayerSalvoes.length) && (salvoData.hitsOnYourOpponent.length == 17) && hitsOnYouArray.length != 17){
            //YOU WIN!!!!!!!!!!!!!!
            $("#gameStatusBox").empty();
            $("#gameStatusBox").html("<h1 class='center bounceInLeft'>YOU SUNK THEIR BATTLESHIPS!</h1><br><h1 class='center animated bounceInLeft'>YOU WIN!!!!</h1>");
            $("#audioBox").html("<audio id='my_audio' src='../Styles/sunkBattleship.mp3'></audio>");
            $("#my_audio").get(0).play();
            $("*").off();
            //SEND WIN TO BACKEND

            var wld = "1";

            $.ajax({
                    url: "/api/scores/" + gpId + "/" + "gameScore",
                    type: "POST",
                    contentType:"application/json",
                    data: wld,
                    success: function(){
                    //alert("SUCCESS!");
                    },
                    error: function(){
                        //alert("ERROR");
                    }
                });
        }

        //CHECK TO SEE IF IT'S A DRAW
        if((loggedInPlayerSalvoes.length == oppositionPlayerSalvoes.length) && (salvoData.hitsOnYourOpponent.length == 17) && hitsOnYouArray.length == 17){

           $("#gameStatusBox").html("<h1 class='center animated bounceInLeft'>IT'S A DRAW</h1>");

            var wld = "0.5";

            $.ajax({
                    url: "/api/scores/" + gpId + "/" + "gameScore",
                    type: "POST",
                    contentType:"application/json",
                    data: wld,
                    success: function(){
                    //alert("SUCCESS!");
                    },
                    error: function(){
                        //alert("ERROR");
                    }
                });

            $("*").off();
        }
console.log("losetest");
console.log(hitsOnYouArray.length);

        //CHECK TO SEE IF THEY HAVE LOST!!
        if((loggedInPlayerSalvoes.length == oppositionPlayerSalvoes.length) && (hitsOnYouArray.length == 17) && (salvoData.hitsOnYourOpponent.length < 17)){


            $("#gameStatusBox").html("<h1 class='center animated bounceInLeft' id='loseId'>YOU LOSE!</h1>");
            $("#audioBox").html("<audio id='my_audio' src='../Styles/Nelson.mp3'></audio>");
            $("#my_audio").get(0).play();
            //SEND LOSE TO BACKEND
            var wld = "lose";

            $.ajax({
                    url: "api/games/players/" + gpId + "/winLoseDraw",
                    type: "POST",
                    contentType:"application/json",
                    data: wld,
                    success: function(){
                        //alert("SUCCESS!");
                    },
                    error: function(){
                        //alert("ERROR");
                    }
                });
            $("*").off();

        }

        //THIS IF MEANS YOU HAVE HIT ALL THEIR BATTLESHIPS BUT TURN NUMBERS ARENT EQUAL
        if((salvoData.hitsOnYourOpponent.length == 17) && (loggedInPlayerSalvoes.length != oppositionPlayerSalvoes.length)){

            $("#gameStatusBox").empty();
            $("#gameStatusBox").html("<h1 class='center'>YOU SUNK THEIR BATTLESHIPS!</h1><br><h2 class='center'>PLEASE WAIT FOR OPPONENT TO FIRE THEIR LAST ROUND</h2><br><h2 class='center'>WILL YOU WIN OR DRAW??</h2>");
        }
    };