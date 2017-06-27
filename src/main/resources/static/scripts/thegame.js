$(document).ready(function () {

    var theLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    var theNumbers = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    function createTheGrid() {

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
    createTheGrid();

    function createSalvoGrid() {

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
    createSalvoGrid();
    //END OF GRID CREATION

    //FUNCTIONS TO RETURN GAMEPLAYER DATA
    function getURL() {

        var theUrl = location.search;

        paramObj(theUrl);

    };

    function paramObj(search) {
        var obj = {};
        var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

        search.replace(reg, function (match, param, val) {
            obj[decodeURIComponent(param)] = val === undefined ? "" : decodeURIComponent(val);
        });

        obj = obj.gp;

        //CALL THE GETJSON FUNCTION
        getGPData(obj);
        getSalvoData(obj);

    }

    //GET LIST OF SHIP LOCATIONS
    function getGPData(x) {

        $.getJSON("http://localhost:8080/api/game_view/" + x, function (gpData) {
            var shipLocation = gpData["ships: "];

            for (var i = 0; i < shipLocation.length; i++) {

                var arrayOfShipLocations = shipLocation[i].location;

                for (var j = 0; j < arrayOfShipLocations.length; j++) {

                    var individualLocation = arrayOfShipLocations[j];

                    fillBackgroundColor(individualLocation);
                };
            }
            addGamePlayerInfo(x, gpData);
        });
    };

    //GET LIST OF SALVO LOCATIONS
    function getSalvoData(x) {

        $.getJSON("http://localhost:8080/api/game_view/" + x, function (salvoData) {
            console.log(salvoData);
            if (salvoData["salvoes: "]["0"]["0"].gamePlayer == x) {

                var salvoLocations = salvoData["salvoes: "]["0"]["0"].locations;
                var numberOfSalvoes = salvoData["salvoes: "]["0"].length;

                for (var i = 0; i < numberOfSalvoes; i++) {

                    for (var j = 0; j < salvoLocations.length; j++) {

                        var eachSalvo = salvoData["salvoes: "]["0"][i].locations[j];
                        var eachTurn = salvoData["salvoes: "]["0"][i].turn;

                        fillBackgroundColorOfSalvoGrid(eachSalvo, eachTurn);
                    }
                }
            } else {

                var salvoLocations = salvoData["salvoes: "][1]["0"].locations;
                var numberOfSalvoes = salvoData["salvoes: "][1].length;

                for (var i = 0; i < numberOfSalvoes; i++) {

                    for (var j = 0; j < salvoLocations.length; j++) {

                       var eachSalvo = salvoData["salvoes: "][1][i].locations[j];
                       var eachTurn = salvoData["salvoes: "][1][i].turn;

                       //var oppositionSalvo = salvoData["salvoes: "]["0"][i].locations[j];
                        //console.log(oppositionSalvo);
                       fillBackgroundColorOfSalvoGrid(eachSalvo, eachTurn);
                    }
                }
            }
        })
    };

    //ADD YOUR SALVOES
    function fillBackgroundColorOfSalvoGrid(gridLocation, eachTurn) {

            $("#" + gridLocation + gridLocation).css("background-color", "green");

            //ADD TURN NUMBER TO SHOTS FIRED
            var turnNumber = eachTurn;
            $("#" + gridLocation + gridLocation).html(turnNumber);

     };

    //ADD THE SHIPS
    function fillBackgroundColor(loc) {

        $("#" + loc).css("background-color", "blue");

    };

    //FUNCTION TO ADD THE GAMEPLAYER INFO
    function addGamePlayerInfo(x, gpData) {

        var gameInfoDiv = $("#whoIsPlayingNViewing");
        var gpData = gpData["gamePlayers: "];

        var playerBoxOne = $("<h3 class='playerBox'></h3>");
        var playerBoxTwo = $("<h3 class='playerBox'></h3>");

        var playerNameOne = gpData[0].player.userName;
        var playerNameTwo = gpData[1].player.userName;

        playerBoxOne.append(playerNameOne);
        playerBoxTwo.append(playerNameTwo);

        /* console.log(x);
         console.log(gpData);*/

        if (gpData[x - 1].gamePlayer_id % 2 != 0) {

            playerBoxOne.append("(YOU)");
        }

        if (gpData[x - 1].gamePlayer_id % 2 == 0) {

            playerBoxTwo.append("(YOU)");
        }

        gameInfoDiv.append(playerBoxOne);
        gameInfoDiv.append(playerBoxTwo);

    };

    getURL();

});
