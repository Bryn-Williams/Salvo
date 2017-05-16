$(document).ready(function(){

    var theLetters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];


function createTheGrid(){

    var theDiv = $("#divForGrid");//GETTING THE DIV
    var theNumbers = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    for(var i = 0; i < 10; i++){

    var row = $("<div class='mainrow'></div>");
    var tiles = $("<div class='tiles'></div>");

    tiles.append(theNumbers[i]);
    row.append(tiles);

        for(var x = 0; x < 10; x++){

            var tiles = $("<div class='tiles'></div>");
            if(i == 0){
            tiles.append(theLetters[x]);
            row.append(tiles);
            }else{

            tiles.attr("id",theLetters[x] + i );
            row.append(tiles)

            }
        }

        theDiv.append(row);
    };
};

createTheGrid();
//END OF GRID CREATION

//FUNCTION TO RETURN GAMEPLAYER DATA
        function getURL(){

            var theUrl = location.search;

            //console.log(theUrl);
            paramObj(theUrl);

        };

        function paramObj(search) {
                var obj = {};
                var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

                search.replace(reg, function(match, param, val) {
                obj[decodeURIComponent(param)] = val === undefined ? "" : decodeURIComponent(val);
                });

                obj = obj.gp;

                //CALL THE GETJSON FUNCTION
                getGPData(obj);

        }

         function getGPData(x){

                $.getJSON("http://localhost:8080/api/game_view/" + x , function(gpData){
                var shipLocation = gpData["ships: "];

                for(var i = 0; i < shipLocation.length; i++){

                var arrayOfShipLocations = shipLocation[i].location;

                        for(var j = 0; j < arrayOfShipLocations.length; j++){

                        var individualLocation = arrayOfShipLocations[j];

                        fillBackgroundColor(individualLocation);
                        };
                }

                addGamePlayerInfo(x, gpData);

                });
         };
         //ADD THE SHIPS
         function fillBackgroundColor(loc){

            $("#" + loc).css("background-color", "red");

         };
         //FUNCTION TO ADD THE GAMEPLAYER INFO

         function addGamePlayerInfo(x, gpData){


             var gameInfoDiv = $("#whoIsPlayingNViewing");
             var gpData = gpData["gamePlayers: "];

                 var playerBoxOne = $("<h3 class='playerBox'></h3>");
                 var playerBoxTwo = $("<h3 class='playerBox'></h3>");

                 var playerNameOne = gpData[0].player.userName;
                 var playerNameTwo = gpData[1].player.userName;

                 playerBoxOne.append(playerNameOne);
                 playerBoxTwo.append(playerNameTwo);

                  if(gpData["0"].gamePlayer_id % 2 != 0){

                    playerBoxOne.append("(YOU)");
                  }

                  if(gpData["0"].gamePlayer_id % 2 == 0){

                  playerBoxTwo.append("(YOU)");
                  }

                 gameInfoDiv.append(playerBoxOne);
                 gameInfoDiv.append(playerBoxTwo);

         };


     getURL();

});