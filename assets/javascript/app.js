$(document).ready(function () {


    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyCa9kIsfAb5dUUjyrbX-bchCAr-V2vhswE",
        authDomain: "project1-c7c87.firebaseapp.com",
        databaseURL: "https://project1-c7c87.firebaseio.com",
        projectId: "project1-c7c87",
        storageBucket: "project1-c7c87.appspot.com",
        messagingSenderId: "4262500453",
        appId: "1:4262500453:web:e39af8863268bd53194e8c"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();




    function updateQuotes() {
        //file:///C:/Users/sb/OneDrive/Documents/BowlerConsulting/UTbootcamp/homework/Project-1/.../
        // required attribution link to be able to use the quote theysaidso.com

        var url = "https://quotes.rest/qod.json?category=inspire";

        $.ajax({ url, method: "GET" })
            .then(function (response) {
                // console.log(response);
                // console.log(response.contents.quotes[0]);
                // console.log(response.contents.quotes[0].quote);
                // console.log(response.contents.quotes[0].author);
                var quote = response.contents.quotes[0].quote;
                var author = response.contents.quotes[0].author;
                $("#quotes").empty();
                $("#quotes").append("<p>Quote of the day: <strong>" + quote + "</strong></p>");
                $("#quotes").append("<p>Author: <strong>" + author + "</strong></p>");
                $("#quotes").append("<p>Source: theysaidso.com </p>");

            }).catch(function (err) {
                console.log(err);
            }
            );
    }

    // file quote.js function goes to "???quoteName???" API and pulls in quote
    updateQuotes();

    //array to hold all interest topics
    var interestTopics = ["Biographies", "History", "Mystery", "Travel"];


    $("#interest-category-form").append("<fieldset id='interest-fieldset'></fieldset>");
    $("#interest-fieldset").append("<legend>Choose your interests:</legend>");

    //for loop to generate interest topics as checkboxes on left column on page load
    for (let i = 0; i < interestTopics.length; i++) {
        var interestTopic = $("<input type='checkbox' name='interest-topic'>")
        var interestTopicLabel = $("<label></label><br>")
        interestTopicLabel.attr("for", interestTopics[i]);
        interestTopicLabel.text(interestTopics[i]);
        interestTopic.attr("value", interestTopics[i]);
        interestTopic.attr("id", interestTopics[i]);
        $("#interest-fieldset").append(interestTopic);
        $("#interest-fieldset").append(interestTopicLabel);

    }
    $("#interest-fieldset").append("<input type='submit' id='save-button' value='Save'/>");

    //  added global variable user for other functions to access, initialized to "", then save click updates (Steve)
    var user = "Not Logged In";

    //take the value of the user name and checkboxes and save to firebase by user on submit button??


    $("#save-button").on("click", function (event) {
        event.preventDefault();

        var userName = $("#user-name").val().trim();
        //add Bootstrap classes/validate data that is entered to the userName 
        user = userName;                            // added to get global user variable for other onclicks and functions (Steve)
        console.log("userName: ", userName);
        console.log("user: ", user);

        //save for if we need to add a random key to the record
        // var autoID =  database.ref().push().key

        // database.ref().child(autoID).set({
        //     name: userName,
        //     autoID: autoID
        //     });


        saveCheckboxes();

        database.ref("userNames/").child(userName).update({
            name: userName
        });

        // $("#user-name").val("");   //SHELVES BRANCH commented out to leave filled for testing, leaves current user name displayed in field

        // SHELVES BRANCH now that user is known, console log any change to current user node in firebase, for favorites etc.
        database.ref("userNames/").child(user).on("value", function (nodeValues) {
            console.log("nodeValues: ", nodeValues);
            console.log("name: ", nodeValues.val().name);
            console.log("favorite: ", nodeValues.val().favorite);
            console.log("read: ", nodeValues.val().read);
            console.log("toRead: ", nodeValues.val().toRead);
            var favorite = nodeValues.val().favorite;
            var read = nodeValues.val().read;
            var toRead = nodeValues.val().toRead;
            $("#bookShelf").empty();
            $("#bookShelf").append("<p>Favorite: <strong>" + favorite + "</strong></p>");
            $("#bookShelf").append("<p>Last Read: <strong>" + read + "</strong></p>");
            $("#bookShelf").append("<p>Next to Read: <strong>" + toRead + "</strong></p>");
        });


    });

    //need to retrive value of all checked checkboxes:
    function saveCheckboxes() {
        var checkboxes = document.getElementsByName("interest-topic");
        var numberOfCheckedItems = 0;
        // var checkedOptions = [];

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {

                numberOfCheckedItems++;
                console.log(numberOfCheckedItems);
            }
        }

    }



    // shelves branch adds to app.js below here

    // each time child added console log data from child, missing favorites, read and toRead
    database.ref().on("child_added", function (childSnapshot) {

        // Log everything that's coming out of snapshot
        console.log(childSnapshot.val().name);

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });




    // with cards loaded in middle column, user clicks add to: favorites, read, toRead buttons, updates userName node in fireBase
    $("#middle-column").on("click", ".card", function (e) {
        event.preventDefault();
        if (user === "Not Logged In") return;
        var thisId = e.target.attributes.getNamedItem("id").textContent;
        console.log(thisId);
        switch (thisId.slice(0, 1).toLowerCase()) {
            case "f": {
                var cardId = "#card-title" + thisId.replace("favorite", "");
                console.log("card ID", cardId);
                console.log("card-title: ", $(cardId).text());
                console.log("onclick card user: ", user);
                database.ref("userNames/").child(user).update({
                    favorite: $(cardId).text()
                });
                break;
            }
            case "t": {
                var cardId = "#card-title" + thisId.replace("toRead", "");
                database.ref("userNames/").child(user).update({
                    toRead: $(cardId).text()
                });
                break;
            }
            case "r": {
                var cardId = "#card-title" + thisId.replace("read", "");
                database.ref("userNames/").child(user).update({
                    read: $(cardId).text()
                });
                break;
            }
        }

    });






}); //end Jquery $documentReady

