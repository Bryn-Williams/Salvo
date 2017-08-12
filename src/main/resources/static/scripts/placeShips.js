$(document).ready(function () {

    createTheGrid();

});

function createTheGrid() {

    var theDiv = $("#divForGrid"); //GETTING THE DIV

    var theLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    var theNumbers = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9"];


    for (var i = 0; i < 10; i++) {

        var row = $("<div class='mainrow'></div>");
        var tiles = $("<div class='numbertiles'></div>");
        var spanny = $("<span></span>");

        spanny.append(theNumbers[i]);
        tiles.append(spanny);
        row.append(tiles);

        for (var x = 0; x < 9; x++) {

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



