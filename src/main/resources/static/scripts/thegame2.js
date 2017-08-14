$(document).ready(function () {

  $.getJSON("api/games", function(scoreboardData){

        createScoreBoard(scoreboardData);

        createListOfGames(scoreboardData);

        checkLogInTwo(scoreboardData);
  });
});

//END OF DOCUMENT READY END OF DOCUMENT READY END OF DOCUMENT READY END OF DOCUMENT READY END OF DOCUMENT READY

    function checkLogInTwo(data){

        if(data.currentPlayer){

           $("#theLoggedInUserSpace").html(data.currentPlayer.name + " is logged in");
           $("#hideMe").hide();

        }
    };

    function checkIfLogIn(){

        $.get("api/games", function(data){

            if(data.currentPlayer != null){

                $("#rightBox").hide();
                var userNameValue = data.currentPlayer.name;
                console.log(userNameValue);

                $("#theLoggedInUserSpace").html(userNameValue + " is logged in");
            }

            if(data.currentPlayer == null){

                  window.open("https://salty-citadel-95879.herokuapp.com/thegame.html", "_self");
                  return;
            }
         })
    }

    //CREATE SCORE BOARD
    function createScoreBoard(data){

        var theData = data.listOfPlayers;

        var theMainTable = $("<table/>");
        var tableHead = $("<tr id=\"topRow\"><th>Name</th><th>Total Score</th><th>Won</th><th>Lost</th><th>Tied</th></tr>");

        theMainTable.append(tableHead);

        for(var i = 0; i < theData.length; i++){

            var tableRow = $("<tr/>");

            var a = theData[i].NameOfPlayer;
            tableRow.append("<td>" + a + "</td>");

            var b = theData[i].Totalscore;
            tableRow.append("<td>" + b + "</td>");

            var c = theData[i].Wins;
            tableRow.append("<td>" + c + "</td>");

            var d = theData[i].Losses;
            tableRow.append("<td>" + d + "</td>");

            var e = theData[i].Ties;
            tableRow.append("<td>" + e + "</td>");

            theMainTable.append(tableRow);
        }

        if(window.location.href == "https://salty-citadel-95879.herokuapp.com/thegame.html"){

        $("#scoreBoard").append(theMainTable);

        }
    }

    function logInFunction(){

       var userNameValue = $("#userId").val();
       var passwordValue = $("#passwordId").val();

       passwordValue = passwordValue.toString();

        //Create object to send
        var userAndPasswordObject = { name: userNameValue , pwd: passwordValue};

        console.log(userAndPasswordObject);

        $.post("/api/login", userAndPasswordObject, function(){

            //alert("Log in successful!")

            $("#theLoggedInUserSpace").html(userNameValue + " is logged in");
            $("#hideMe").hide();

        }).fail(function(){

            alert("Username or Password incorrect");
        })
    };

    function logOutFunction(){

        $.post("/api/logout").done(function() {

            alert("log out successful!");
                  window.open("https://salty-citadel-95879.herokuapp.com/thegame.html", "_self");
        })
    }

    function returnToMainPage(){

        window.open("https://salty-citadel-95879.herokuapp.com/thegame.html", "_self");
    }

    function signUpFunction() {

        var userNameValue = $("#userId").val();
        var passwordValue = $("#passwordId").val();
        passwordValue = passwordValue.toString();

        var newUserAndPasswordObject = { name: userNameValue , pwd: passwordValue};

        console.log(newUserAndPasswordObject);


        $.post("api/players", newUserAndPasswordObject, function(){

            alert("Sign Up successful");

            logInFunction();

        }).fail(function(){

           if(!userNameValue){

               alert("please add a username");
            }else{
                alert("Username already taken");
            }
        })
    }

    function createListOfGames(data){

           var theList = $("#theList");
           var theData = data.games;
            $.each(theData, function(key,value){

                var newListItem = $("<li></li>");

                $.each(value.gamePlayers, function(key2,value2){

                    //console.log(value.gamePlayers.length);
                    if(value.gamePlayers.length == 2){

                        var theEmail = value2.player.email;

                        newListItem.append(" " + theEmail + " ");
                        newListItem.append('<button onclick="takeMeToMyGame(\'' + value2.id + '\',\'' + theEmail + '\')">GO TO GAME</button>');
                    }
                    if(value.gamePlayers.length == 1){
                        var theEmail = value2.player.email;

                        newListItem.append(" " + theEmail + " ");
                        newListItem.append('<button onclick="takeMeToMyGame(\'' + value2.id + '\',\'' + theEmail + '\')">GO TO GAME</button>');
                        newListItem.append('<button onclick="joinGame(\'' + value.gameId + '\')">JOIN GAME</button>');

                    }
                })

            theList.append(newListItem);

            });
    }

    function takeMeToMyGame(theGamePlayerID, theEmail){

    $.get("api/games", function(data){

        console.log(data.currentPlayer);

        if(data.currentPlayer != null){

                var theCurrentPlayerName = data.currentPlayer.name;
                var theCurrentPlayerId = data.currentPlayer.id;

                console.log(theCurrentPlayerName);

                if(theCurrentPlayerName == theEmail){

                     window.open("https://salty-citadel-95879.herokuapp.com/games.html?gp=" + theGamePlayerID + "","_self");

                } else{

                    alert("YOU AREN'T IN THIS GAME!!");
                }

        }else{
            alert("YOU MUST LOG IN TO SEE YOUR GAMES");
        }

    })
    }

    function createGameFunction(){

         $.get("api/games", function(data){

            if(data.currentPlayer != null){
                $.post("api/games", function(){

                })

            //OPENS PLACE SHIPS PAGE!
            window.open("https://salty-citadel-95879.herokuapp.com/placeShipsPage.html","_self");

            }else{
                alert("you must log in to create a game");
            }
         })
    }

    function joinGame(gameId){

           $.ajax({

            url: "api/games/" + gameId + "/players",
            type: "POST",
            success: function(data){

                alert("SUCCESS!");
                window.open("https://salty-citadel-95879.herokuapp.com/placeShipsPage.html","_self");

            },
            error: function(){
                alert("YOUR OPPONENT IS STILL PLACING THEIR SHIPS, PLEASE TRY AGAIN IN ONE MOMENT");
            }
        });
    }

    function isRadioBoxChecked(shipType, shipLength) {

            $("*").off();

            if ($('#' + shipType).is(':checked') && $("#vertical").is(':checked')) {

                $(".tiles").hover(function () {

                    var theCurrentSquare = this.id;
                    var theNumberOfCurrentSquare = theCurrentSquare.substring(1);
                    var theLetterOfCurrentSquare = theCurrentSquare.substring(0, 1);

                    var arrayOfShipPositions = [];
                    arrayOfShipPositions.push(theCurrentSquare);

                    var colorOfSquare = $("#" + theCurrentSquare).css("background-color");

                    for (var i = 1; i < shipLength; i++) {

                        var numberPlusOne = parseInt(theNumberOfCurrentSquare) + i;
                        numberPlusOne = numberPlusOne.toString();

                        var squareBelowThis = theLetterOfCurrentSquare + numberPlusOne;

                        if (colorOfSquare == "rgb(255, 0, 0)" || $("#" + squareBelowThis).css("background-color") == "rgb(255, 0, 0)") {
                            return;
                        }

                        $(this).css("background-color", "yellow");
                        $("#" + squareBelowThis).css("background-color", "yellow");

                        arrayOfShipPositions.push(squareBelowThis);
                    }


                    //BELOW IS FUNCTION TO MAKE SQUARES TRANSPARENT IF SHIP PLACEMENT IS INVALID
                    var indexOfLastArrayItem = arrayOfShipPositions.length - 1;
                    var coordinateOfLastSquare = arrayOfShipPositions[indexOfLastArrayItem];
                    var theNumberOfCoordinateOfLastSquare = coordinateOfLastSquare.slice(1);

                    if (theNumberOfCoordinateOfLastSquare == 10 || theNumberOfCoordinateOfLastSquare == 11 || theNumberOfCoordinateOfLastSquare == 12 || theNumberOfCoordinateOfLastSquare == 13 || theNumberOfCoordinateOfLastSquare == 14) {

                        for (var b = 0; b < arrayOfShipPositions.length; b++) {

                            $(this).css("background-color", "transparent");

                            var currentSquare = arrayOfShipPositions[b];
                            $("#" + currentSquare).css("background-color", "transparent");

                        }
                    }
                    //END OF FUNCTION FOR INVALID PLACEMENT


                    //FUNCTION TO PLACE SHIPS ON CLICK
                    $(this).click(function () {

                        if ($(this).css("background-color") != "rgb(255, 255, 0)") {
                            return;
                        } else {

                            for (var z = 0; z < arrayOfShipPositions.length; z++) {

                                var squareToFillOnceClicked = arrayOfShipPositions[z];
                                $("#" + squareToFillOnceClicked).css("background-color", "red");

                            }
                        }

                        //REMOVES SHIP FROM TABLE ONCE CLICKED
                        var theRowToRemove = shipType + "Row";
                        $('#' + theRowToRemove).remove();
                        $("*").off();
                        //END OF REMOVAL FUNCTION

                        //SEND SHIP POSITION TO OTHER FUNCTION SO THAT IT CAN BE SAVED IN DATABASE
                        getValuesOfShipPlacementAndConstructJsonObject(arrayOfShipPositions, shipType);
                    });

                    //WHEN MOUSE LEAVES SQUARE
                }, function () {

                    var theCurrentSquare = this.id;
                    var theNumberOfCurrentSquare = theCurrentSquare.substring(1);
                    var theLetterOfCurrentSquare = theCurrentSquare.substring(0, 1);
                    var colorOfSquare = $("#" + theCurrentSquare).css("background-color");

                    if (colorOfSquare == "rgb(255, 0, 0)") {
                        return;

                    } else {

                        for (var i = 1; i < shipLength; i++) {

                            var numberPlusOne = parseInt(theNumberOfCurrentSquare) + i;
                            numberPlusOne = numberPlusOne.toString();

                            var squareBelowThis = theLetterOfCurrentSquare + numberPlusOne;

                            if ($("#" + squareBelowThis).css("background-color") == "rgb(255, 0, 0)") {
                                return;
                            }

                            $(this).css("background-color", "transparent");
                            $("#" + squareBelowThis).css("background-color", "transparent");
                        }
                    }
                });
            }




            //CODE TO CHANGE TO HORIZONTAL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            if ($('#' + shipType).is(':checked') && $("#horizontal").is(':checked')) {

                $(".tiles").hover(function () {

                    var theCurrentSquare = this.id;
                    var theNumberOfCurrentSquare = theCurrentSquare.substring(1);
                    var theLetterOfCurrentSquare = theCurrentSquare.substring(0, 1);

                    var arrayOfShipPositions = [];
                    arrayOfShipPositions.push(theCurrentSquare);

                    var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
                    var indexOfCurrentLetter = alphabet.indexOf(theLetterOfCurrentSquare);
                    var colorOfSquare = $("#" + theCurrentSquare).css("background-color");


                    for (var x = 1; x < shipLength; x++) {

                        var letterToRightOfThis = indexOfCurrentLetter + x;
                        var squareToRight = alphabet[letterToRightOfThis] + theNumberOfCurrentSquare;

                        if (colorOfSquare == "rgb(255, 0, 0)" || $("#" + squareToRight).css("background-color") == "rgb(255, 0, 0)") {
                            return;
                        }

                        $(this).css("background-color", "blue");
                        $("#" + squareToRight).css("background-color", "blue");

                        arrayOfShipPositions.push(squareToRight);
                    }

                    //BELOW IS FUNCTION TO MAKE SQUARES TRANSPARENT IF SHIP PLACEMENT IS INVALID

                    var indexOfLastArrayItem = arrayOfShipPositions.length - 1;
                    var coordinateOfLastSquare = arrayOfShipPositions[indexOfLastArrayItem];

                    var letterOfCoordinateOfLastSquare = coordinateOfLastSquare.substring(0, 1);

                    console.log(letterOfCoordinateOfLastSquare);


                    if (letterOfCoordinateOfLastSquare == "u") {

                        for (var b = 0; b < arrayOfShipPositions.length; b++) {

                            $(this).css("background-color", "transparent");

                            var currentSquare = arrayOfShipPositions[b];
                            $("#" + currentSquare).css("background-color", "transparent");

                        }
                    }
                    //END OF FUNCTION FOR INVALID PLACEMENT*/

                    //FUNCTION TO PLACE SHIPS ON CLICK
                    $(this).click(function () {

                        if ($(this).css("background-color") != "rgb(0, 0, 255)") {
                            return;
                        } else {

                            for (var z = 0; z < arrayOfShipPositions.length; z++) {

                                var squareToFillOnceClicked = arrayOfShipPositions[z];
                                $("#" + squareToFillOnceClicked).css("background-color", "red");

                            }
                        }

                        //REMOVES SHIP FROM TABLE ONCE CLICKED
                        var theRowToRemove = shipType + "Row";
                        $('#' + theRowToRemove).remove();
                        $("*").off();
                        //END OF REMOVAL FUNCTION

                        //SEND SHIP POSITION TO OTHER FUNCTION SO THAT IT CAN BE SAVED IN DATABASE
                        getValuesOfShipPlacementAndConstructJsonObject(arrayOfShipPositions, shipType);
                    });

                    //WHEN MOUSE LEAVES SQUARE
                }, function () {

                    var theCurrentSquare = this.id;
                    var theNumberOfCurrentSquare = theCurrentSquare.substring(1);
                    var theLetterOfCurrentSquare = theCurrentSquare.substring(0, 1);
                    var colorOfSquare = $("#" + theCurrentSquare).css("background-color");


                    var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
                    var indexOfCurrentLetter = alphabet.indexOf(theLetterOfCurrentSquare);

                    if (colorOfSquare == "rgb(255, 0, 0)") {
                        return;

                    } else {

                        for (var x = 1; x < shipLength; x++) {

                            var letterToRightOfThis = indexOfCurrentLetter + x;

                            if ($("#" + alphabet[letterToRightOfThis] + theNumberOfCurrentSquare).css("background-color") == "rgb(255, 0, 0)") {
                                return;
                            }

                            $(this).css("background-color", "transparent");
                            $("#" + alphabet[letterToRightOfThis] + theNumberOfCurrentSquare).css("background-color", "transparent");
                        }
                    }
                });
            }
        };

    function changeToHoriz() {

            var shipType = $('input[type=radio][name=shiptype]:checked').attr('id');

            if (shipType == "carrier") {
                var shiplength = 5;
                isRadioBoxChecked(shipType, shiplength);
            }

            if (shipType == "battleship") {
                var shiplength = 4;
                isRadioBoxChecked(shipType, shiplength);
            }

            if (shipType == "submarine" || shipType == "destroyer") {
                var shiplength = 3;
                isRadioBoxChecked(shipType, shiplength);
            }

            if (shipType == "patrolboat") {
                var shiplength = 2;
                isRadioBoxChecked(shipType, shiplength);
            }
        }

    var fleet = [];
    function getValuesOfShipPlacementAndConstructJsonObject(arrayOfShipPositionse, shipTypee){

                var shipLocationAndType = {};

                shipLocationAndType.shipLocation = arrayOfShipPositionse;
                shipLocationAndType.shipType = shipTypee;

                fleet.push(shipLocationAndType);

                sendFleetToAjaxFunction(fleet);

        }

    function sendFleetToAjaxFunction(fleet){

            if(fleet.length != 5){
                return;
            }

             //$GET TO GET GP ID
             $.get("api/games", function(data){

                //START OF SHIT TO GET GPID
                var allgpids = [];

                for(var x = 0; x < data.games.length; x++){
                    for(var y = 0; y < data.games[x].gamePlayers.length; y++){

                        allgpids.push(data.games[x].gamePlayers[y].id);
                    }
                }

                var gamePlayerId = 0;

                for(var z=0; z< allgpids.length; z++){
                    if(allgpids[z] > gamePlayerId){
                        gamePlayerId = allgpids[z];
                     }
                }
                //END OF SHIT TO GET GPID

                console.log(allgpids);

                //SEND THE FLEET(ARRAY) TO THE DB
                $.ajax({

                    url: "api/games/players/" + gamePlayerId + "/ships",
                    type: "POST",
                    contentType:"application/json",
                    data: JSON.stringify(fleet),
                    success: function(){

                        alert("SUCCESS!");
                        window.open("https://salty-citadel-95879.herokuapp.com/games.html?gp=" + gamePlayerId ,"_self");
                    },
                    error: function(){
                        alert("ERROR");
                    }
                })
             })
        }








