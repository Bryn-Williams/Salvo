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

        theDiv.append("<h2>Your Crew!</h2>");

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
        theDiv.append("<h2>Your Shots!</h2>");

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

                 fillBackgroundColor(chloesSalvos);//ADD CHLOE'S SALVOS TO JACKS GRID TO SEE IF JACK HAS BEEN HIT
                 addGamePlayerInfo(x, salvoData);
             }

            //addGamePlayerInfo(x, salvoData);
    };

    //ADD YOUR SALVOES TO RIGHT GRID
    function fillBackgroundColorOfSalvoGrid(gridLocation, eachTurn, hitsOnYourOpponent) {

                $("#" + gridLocation).css("background-color", "green");

                //ADD TURN NUMBER TO SHOTS FIRED
                var turnNumber = eachTurn;
                $("#" + gridLocation).html(turnNumber);

                for(var x = 0; x < hitsOnYourOpponent.length; x++){

                    var currentLocation = hitsOnYourOpponent[x].hitLocation;

                     //CHANGE COLOR OF SQUARE IF U HIT YOUR OPPONENT!
                     $("#" + currentLocation + currentLocation).css("background-color", "red");
                     $("#" + currentLocation + currentLocation).html("hit");
                }
     };

    //GET LIST OF SALVO LOCATIONS
    function getSalvoData(x) {

            $.getJSON("http://localhost:8080/api/game_view/" + x, function (bigData){

            var salvoData = bigData;
            var hitsOnYourOpponent = salvoData.hitsOnYourOpponent;

                if (salvoData.salvoes["0"]["0"].gamePlayer == x) {

                    var salvoLocations = salvoData.salvoes["0"]["0"].locations;
                    var numberOfSalvoes = salvoData.salvoes["0"].length;

                    var chloesSalvos = salvoData.salvoes["1"];

                    for (var i = 0; i < numberOfSalvoes; i++) {

                        for (var j = 0; j < salvoLocations.length; j++) {

                            var eachSalvo = salvoData.salvoes["0"][i].locations[j];
                            var eachTurn = salvoData.salvoes["0"][i].turn;

                            fillBackgroundColorOfSalvoGrid(eachSalvo, eachTurn, hitsOnYourOpponent);
                        }

                    }
                    fillHitsOnOpponentTable(hitsOnYourOpponent);

                } else {

                    var salvoLocations = salvoData.salvoes[1]["0"].locations;
                    var numberOfSalvoes = salvoData.salvoes[1].length;
                    var chloesSalvos = salvoData.salvoes["0"];

                    for (var i = 0; i < numberOfSalvoes; i++) {

                        for (var j = 0; j < salvoLocations.length; j++) {

                           var eachSalvo = salvoData.salvoes[1][i].locations[j];
                           var eachTurn = salvoData.salvoes[1][i].turn;

                           fillBackgroundColorOfSalvoGrid(eachSalvo, eachTurn, hitsOnYourOpponent);
                        }
                    }
                    fillHitsOnOpponentTable(hitsOnYourOpponent);

                }

            });
        };

    //ADD THE SHIPS TO LEFT GRID - is this correct? PRETTY SURE IT ADDS OPPOSITION SALVOES TO LEFT GRID
    function fillBackgroundColor(chloesSalvos) {

            var yourShipsHaveBeenHitHere = [];

            if(!chloesSalvos){return;};

                 for(var i = 0; i < chloesSalvos.length;i++){
                      for(var x = 0; x < chloesSalvos[i].locations.length; x++){

                          var chloeEachSalvo = chloesSalvos[i].locations[x];
                          chloeEachSalvo = chloeEachSalvo.slice(2);

                              if($("#" + chloeEachSalvo).hasClass("blue")){

                               $("#" + chloeEachSalvo).addClass("red");
                               $('#' + chloeEachSalvo).text("hit");

                               yourShipsHaveBeenHitHere.push(chloeEachSalvo);

                               }else{
                                    $("#" + chloeEachSalvo).addClass("green");
                                    $('#' + chloeEachSalvo).text("they miss");
                               }
                              //THIS IF -- CALL hasPlayerOneBeenHit() ON LAST ITERATION OF ABOVE LOOPS
                              if(i + 1 == chloesSalvos.length && x + 1 == chloesSalvos[i].locations.length){

                                    //CALL FUNCTION TO CREATE JSON OBJECT THAT RECORDS IF LEFT GRID HAS HITS
                                    var turnyNumber = chloesSalvos.length;
                              }
                      }
                 }
      };

    //FUNCTION TO ADD THE GAMEPLAYER INFO
    function addGamePlayerInfo(x, gpData) {

          var gameInfoDiv = $("#whoIsPlayingNViewing");
          var gpData = gpData.gamePlayers;

          var playerBoxOne = $("<h3 class='playerBox'></h3>");
          var playerBoxTwo = $("<h3 class='playerBox'></h3>");

        //console.log(gpData.length)

        if(gpData.length == 1){

            var playerNameOne = gpData[0].player;
            playerBoxOne.append(playerNameOne + "(YOU)");
            gameInfoDiv.append(playerBoxOne);


        }else{

                  var playerNameOne = gpData[0].player;
                  playerBoxOne.append(playerNameOne);
                  var playerNameTwo = gpData[1].player;
                  playerBoxTwo.append(playerNameTwo);

                  gameInfoDiv.append(playerBoxOne);
                  gameInfoDiv.append(playerBoxTwo);
        }
      };

    function placeFirstRoundOfSalvoes(gpId, theData){

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

                     if(firstRoundOfSalvoes.includes(this.id)){
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


    function fillHitsOnOpponentTable(hitsOnYourOpponent){

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
    }




