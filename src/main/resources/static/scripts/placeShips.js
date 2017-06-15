$(document).ready(function () {

    createTheGrid();

});



function createTheGrid() {

    var theDiv = $("#divForGrid"); //GETTING THE DIV

    var theLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    var theNumbers = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];


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

            //EVENT LISTENER TO PLACE SHIPS
            $(this).click(function () {

                for (var z = 0; z < arrayOfShipPositions.length; z++) {

                    var squareToFillOnceClicked = arrayOfShipPositions[z];

                    console.log(squareToFillOnceClicked);

                    $("#" + squareToFillOnceClicked).css("background-color", "red");

                }

                //REMOVES SHIP FROM TABLE ONCE CLICKED
                var theRowToRemove = shipType + "Row";
                $('#' + theRowToRemove).remove();
                $("*").off();

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

            var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
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

            //EVENT LISTENER TO PLACE SHIPS
            $(this).click(function () {

                for (var z = 0; z < arrayOfShipPositions.length; z++) {

                    var squareToFillOnceClicked = arrayOfShipPositions[z];
                    $("#" + squareToFillOnceClicked).css("background-color", "red");
                }

                var theRowToRemove = shipType + "Row";
                $('#' + theRowToRemove).remove();
                $("*").off();

            });

            //WHEN MOUSE LEAVES SQUARE
        }, function () {

            var theCurrentSquare = this.id;
            var theNumberOfCurrentSquare = theCurrentSquare.substring(1);
            var theLetterOfCurrentSquare = theCurrentSquare.substring(0, 1);
            var colorOfSquare = $("#" + theCurrentSquare).css("background-color");


            var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
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
