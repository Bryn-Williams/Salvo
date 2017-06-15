$(document).ready(function () {

  $.getJSON("http://localhost:8080/api/games", function(scoreboardData){

        createScoreBoard(scoreboardData);

        createListOfGames(scoreboardData);

        checkIfLogIn();

  });
});

//END OF DOCUMENT READY END OF DOCUMENT READY END OF DOCUMENT READY END OF DOCUMENT READY END OF DOCUMENT READY

    function checkIfLogIn(){

        $.get("api/games", function(data){

            if(data.currentPlayer != null){

                $("#rightBox").hide();
                var userNameValue = data.currentPlayer.name;
                console.log(userNameValue);

                $("#theLoggedInUserSpace").html(userNameValue + " is logged in");
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

        if(window.location.href == "http://localhost:8080/thegame.html"){

        $("#scoreBoard").append(theMainTable);

        }
    }

    //GET DATA FROM FORM
    function logInFunction(){

       var userNameValue = $("#userId").val();
       var passwordValue = $("#passwordId").val();

       passwordValue = passwordValue.toString();

        //Create object to send
        var userAndPasswordObject = { name: userNameValue , pwd: passwordValue};

        //console.log(userAndPasswordObject);

        $.post("/api/login", userAndPasswordObject, function(){

            alert("Log in successful!")

            $("#theLoggedInUserSpace").html(userNameValue + " is logged in");
            $("#rightBox").hide();

        }).fail(function(){

            alert("Username or Password incorrect");
        })
    };

    function logOutFunction(){

        $.post("/api/logout").done(function() {

            alert("log out successful!");

            var loggedInPerson = $("#theLoggedInUserSpace");

            if(loggedInPerson.html()){

                loggedInPerson.empty();
                location.reload();//location.reload() is the same as refresh the page
            }
        })
    }

    function signUpFunction() {

        var userNameValue = $("#userId").val();
        var passwordValue = $("#passwordId").val();
        passwordValue = passwordValue.toString();

        var newUserAndPasswordObject = { name: userNameValue , pwd: passwordValue};

        $.post("api/players", newUserAndPasswordObject, function(){

            alert("Sign Up successful");
        }).fail(function(){

           if(!userNameValue){

               alert("please add a username");
            }else{
                alert("Name already taken");

            }
        })
    }

    //Create list of games info
    function createListOfGames(data){

           var theList = $("#theList");
           var theData = data.games;
           //var theLoggedInPlayer = data.currentPlayer.name;
           //console.log(theLoggedInPlayer);

            $.each(theData, function(key,value){

                var newListItem = $("<li>" + "Game no. " + value.gameId + "," + " Created: "+ value.created + "," + "</li>");

                $.each(value.gamePlayers, function(key2,value2){

                    console.log(value.gamePlayers.length);
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

                     window.open("http://localhost:8080/games.html?gp=" + theGamePlayerID + "","_self");

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
                location.reload();

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
                theGamePlayerID = data.newGpID;
                window.open("http://localhost:8080/games.html?gp=" + theGamePlayerID + "","_self");

            },
            error: function(){
                alert("YOU MUST SIGN IN TO JOIN A GAME");
            }
        });
    }

   /* //START OF ADDING SHIPS
    function getValuesOfShipPlacementAndConstructJsonObject(){

        var objectOfShipLocation = {

            shipType: "",
            shipLocation: []
        }

        //ADD OBJECTS ABOVE TO ARRAY BELOW!!


        var arrayOfShips = [];


        //SEND YOUR NEWLY CREATED OBJECT
        $.ajax({

            url: "api/games/players/{gpId}/ships",
            type: "POST",
            contentType:"application/json",
            //TODO add stringify to data: arrayOfShips
            data: arrayOfShips,
            success: function(){

                alert("SUCCESS!");

            },
            error: function(){
                alert("ERROR");
            }
        })
    }*/




