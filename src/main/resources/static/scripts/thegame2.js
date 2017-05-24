$(document).ready(function () {

  var x = getURL();

  $.getJSON("http://localhost:8080/api/game_view/" + x, function (bigData) {
        //CALL THE FUNCTIONS HERE
        var theData = bigData;

        createTheGrid();
        createSalvoGrid();

        fillLeftGrid(x, theData);
        getSalvoData(x, theData);

  });
});

//END OF DOCUMENT READY END OF DOCUMENT READY END OF DOCUMENT READY END OF DOCUMENT READY END OF DOCUMENT READY

    function createTheGrid() {

        var theLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        var theNumbers = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        var theDiv = $("#divForGrid"); //GETTING THE DIV

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

                    tiles.attr("id", theLetters[x] + i + theLetters[x] + i);
                    row.append(tiles)
                }
            }
            theDiv.append(row);
        };


    };

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

    //GET LIST OF SHIP LOCATIONS
    function fillLeftGrid(x, theData) {

            var salvoData = theData;
            var shipLocation = salvoData.ships;

            console.log(salvoData);

             if (salvoData.salvoes["0"]["0"].gamePlayer == x) {

                var chloesSalvos = salvoData.salvoes["1"];

             }else {

                var chloesSalvos = salvoData.salvoes["0"];
             }

            //GET JACK'S SHIPS
            for (var i = 0; i < shipLocation.length; i++) {

                var arrayOfShipLocations = shipLocation[i].location;

                for (var j = 0; j < arrayOfShipLocations.length; j++) {

                    var individualLocation = arrayOfShipLocations[j];
                    console.log(individualLocation);
                    $("#" + individualLocation).addClass("blue");
                };
            }
            fillBackgroundColor(chloesSalvos);
            addGamePlayerInfo(x, salvoData);
    };

    //GET LIST OF SALVO LOCATIONS
    function getSalvoData(x, theData) {

           var salvoData = theData;

           //console.log(salvoData);
            if (salvoData.salvoes["0"]["0"].gamePlayer == x) {

                var salvoLocations = salvoData.salvoes["0"]["0"].locations;
                var numberOfSalvoes = salvoData.salvoes["0"].length;

                var chloesSalvos = salvoData.salvoes["1"];
                //console.log(chloesSalvos);

                for (var i = 0; i < numberOfSalvoes; i++) {

                    for (var j = 0; j < salvoLocations.length; j++) {

                        var eachSalvo = salvoData.salvoes["0"][i].locations[j];
                        var eachTurn = salvoData.salvoes["0"][i].turn;

                        fillBackgroundColorOfSalvoGrid(eachSalvo, eachTurn, chloesSalvos);
                        //ADD CHLOES SALVOS TO FUNCTION ABOVE AND TEST EACH SALVO AGAINST HER ARRAYS!!!
                    }
                }
            } else {

                var salvoLocations = salvoData.salvoes[1]["0"].locations;
                var numberOfSalvoes = salvoData.salvoes[1].length;
                var chloesSalvos = salvoData.salvoes["0"];
                //console.log(chloesSalvos);

                for (var i = 0; i < numberOfSalvoes; i++) {

                    for (var j = 0; j < salvoLocations.length; j++) {

                       var eachSalvo = salvoData.salvoes[1][i].locations[j];
                       var eachTurn = salvoData.salvoes[1][i].turn;

                       //console.log(eachSalvo);
                       fillBackgroundColorOfSalvoGrid(eachSalvo, eachTurn, chloesSalvos);
                    }
                }
            }
    };

    //ADD YOUR SALVOES TO RIGHT GRID
    function fillBackgroundColorOfSalvoGrid(gridLocation, eachTurn, chloesSalvos) {

            $("#" + gridLocation + gridLocation).css("background-color", "green");

            //ADD TURN NUMBER TO SHOTS FIRED
            var turnNumber = eachTurn;
            $("#" + gridLocation + gridLocation).html(turnNumber);
     };

    //ADD THE SHIPS
    function fillBackgroundColor(chloesSalvos) {

               for(var i = 0; i < chloesSalvos.length;i++){

                    for(var x = 0; x < chloesSalvos[i].locations.length; x++){

                        var chloeEachSalvo = chloesSalvos[i].locations[x];

                            if($("#" + chloeEachSalvo).hasClass("blue")){

                             $("#" + chloeEachSalvo).addClass("red");
                             $('#' + chloeEachSalvo).text("u got hit");
                             }else{
                             $("#" + chloeEachSalvo).addClass("green");
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

        var playerNameOne = gpData[0].player.userName;
        var playerNameTwo = gpData[1].player.userName;

        playerBoxOne.append(playerNameOne);
        playerBoxTwo.append(playerNameTwo);

        if (gpData[x - 1].gamePlayer_id % 2 != 0) {

            playerBoxOne.append("(YOU)");
        }

        if (gpData[x - 1].gamePlayer_id % 2 == 0) {

            playerBoxTwo.append("(YOU)");
        }
        gameInfoDiv.append(playerBoxOne);
        gameInfoDiv.append(playerBoxTwo);
    };








