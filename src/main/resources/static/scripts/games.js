$(document).ready(function(){

    $.get("http://localhost:8080/api/games").done(function(theData){

        var theList = $("#theList");
        theData = theData.Games;

    $.each(theData, function(key,value){

        var newListItem = $("<li>" + "Game no. " + value.id + "," + " Created: "+ value.created + "," + "</li>");

    $.each(value.gamePlayers, function(key2,value2){

        newListItem.append(" " + value2.player.email + " ");

    })

    theList.append(newListItem);

        });

    });

});