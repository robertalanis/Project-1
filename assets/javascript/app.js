$(document).ready(function () {

    var favorite = "";
    var read = "";
    var toRead = "";

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
    var auth = firebase.auth();



    //on page  load, randomly selected topic from array pushes books from API call 
    var  bookShelfTopic = ["fiction", "fantasy", "non-fiction", "classics", "science-fiction", "audiobook", "novels", "science", "humor", "literature", "psychology", 
    "politics", "school", "dystopia", 'self-help', 'read-for-school', "health", "medical", "popular-science", "skepticism"];

    var randomShelfTopic = bookShelfTopic[Math.floor(Math.random() * bookShelfTopic.length)]
    // console.log("random topic: " + randomShelfTopic);

    var url = "https://cors-anywhere.herokuapp.com/https://www.goodreads.com/shelf/show/" + randomShelfTopic;
    // console.log("random url: " + url);
    var bookArray = [];
    $.ajax({
        url,
        method: "GET",
    })
        .then(function (response) {
            // console.log("response: ", response);
            var el = document.createElement('html');
            el.innerHTML = response;
            var allTags = el.getElementsByTagName('a'); // Live NodeList of anchor elements this works
            // console.log("allTags: ", allTags);
            for (var i = 0; i < allTags.length; i++) {
                var titleTagClass = allTags[i].classList[0]; // Live NodeList of anchor elements this works
                if (titleTagClass === "bookTitle") {
                    var titleImageHref = "https://www.goodreads.com" + allTags[i].getAttribute('href');
                    var authorHref = allTags[i + 1].getAttribute('href');
                    var bookTag = {
                        title: allTags[i].textContent,
                        titleImageHref: titleImageHref,
                        author: allTags[i + 1].textContent,
                        authorHref: authorHref,
                        image: allTags[i - 1].innerHTML
                    }
                    bookArray.push(bookTag);
                }
            }

            //List 10 Titles from the Search Results
            for (let index = 0; index < 5; index++) {

                // Div for each Book
                var div = $("<div class='card' id='card-body'>");
                // Image tag each Book
                var img = $(bookArray[index].image);
                    // img.attr("src", bookArray[index].image);
                // Title tag for each Book
                var pTitle = $("<p class='card-title'>");
                    pTitle.text(bookArray[index].title);
                // Author tag for each Book
                var pAuthor = $("<p class='card-text'>");
                    pAuthor.text(bookArray[index].author);

                var favoriteButton = $("<button>Favorite</button>");
                var readButton = $("<button>Did Read</button>");
                var willReadButton = $("<button>Will Read</button>");
                var buttonDiv = $('<div class="buttonDiv">');
                    buttonDiv.append(favoriteButton);
                    buttonDiv.append(readButton);
                    buttonDiv.append(willReadButton);

                favoriteButton.attr("id", "favorite" + index.toString());
                readButton.attr("id", "read" + index.toString());
                willReadButton.attr("id", "toRead" + index.toString());

                pTitle.attr("id", "card-title" + index.toString())

            var imgButton = $('<div id=imgButton style="float:left;">')
                imgButton.append(img);
                imgButton.append(favoriteButton);
                imgButton.append(readButton);
                imgButton.append(willReadButton);

                div.append(imgButton);
                //div.append(img);
                //div.append(buttonDiv);
                div.append(pTitle);
                div.append(pAuthor);
                div.addClass("resultDiv");
                $("#middle-column").prepend(div);


            }

            console.log("bookArray: ", bookArray);
        }).catch(function (err) {
            console.log("err: ", err);
        });





    //listen for auth status changes
    auth.onAuthStateChanged(user => {

        if (user) {
            // console.log("user logged in: ", user);
            $("#user-logged-in").text(user.displayName);

            //save "displayName" to update and login button to add data to user node in database
            $("#update-button").attr("data-id", user.displayName);
            $("#login-button").attr("data-id", user.displayName);
            userName = user.displayName;
            // console.log(userName);
            databaseSnapshotToPage();
        }
        else {
            console.log("user logged out");
            $("#update-button").removeAttr("data-id");
            $("#login-button").removeAttr("data-id");
        }
    });


    function databaseSnapshotToPage() {

        $("#current-preferences").empty();

        //on login or click to update preferences, (or click to add to bookshelves), capture current data in database:
        // var preferences = firebase.database().ref('userNames/' + userName + '/preferences');
        var preferences = firebase.database().ref('userNames/' + userName);  // changed to get full userName object to read favorite, toRead and read
        preferences.once('value', function (snapshot) {
            valueCheckboxes = snapshot.val().preferences;       // added .preferences
            // console.log(valueCheckboxes);


            // added to load bookShelf div
            favorite = snapshot.val().favorite;                 // added to load bookShelf
            // console.log("favorite: ", favorite);
            read = snapshot.val().read;                         // added to load bookShelf
            toRead = snapshot.val().toRead;                     // added to load bookShelf
            updateShelf();
            // end of bookShelf adds


            // console.log(snapshot);
            eachInterestList = $("<ul>");
            $("#current-preferences").append(eachInterestList);

            for (let i = 0; i < valueCheckboxes.length; i++) {
                eachInterest = $("<li>")
                eachInterest.attr({
                    class: "interests",
                    id: valueCheckboxes[i]
                });
                eachInterest.text(valueCheckboxes[i])
                eachInterestList.append(eachInterest);
            }
        });
    }


    function updateQuotes() {
        //file:///C:/Users/sb/OneDrive/Documents/BowlerConsulting/UTbootcamp/homework/Project-1/.../
        // required attribution link to be able to use the quote theysaidso.com

        var url = "https://quotes.rest/qod.json?category=inspire";

        $.ajax({ url, method: "GET" })
            .then(function (response) {
                var quote = response.contents.quotes[0].quote;
                var author = response.contents.quotes[0].author;
                $("#quotes").empty();
                $("#quotes").append("<p>Quote of the day: <strong>" + quote + "</strong></p>");
                $("#quotes").append("<p>Author: <strong>" + author + "</strong></p>");
                $("#quotes").append("<p>Source: theysaidso.com </p>");

            }).catch(function (err) {
                console.log(err);
            });
    }

    // goes to "theysaidso??" API and pulls in quote
    updateQuotes();

    //array to hold all interest topics
    var interestTopics = [
        "Art", "Biographies", "Business", "Children", "Christian", "Classics", "Comics", "Fantasy",
        "Historical Fiction", "History", "Horror", "Music", "Mystery", "Nonfiction", "Romance",
        "Science Fiction", "Sports", "Travel", "Young  Adult"];

    // empty array to populate with checked checkboxes when user clicks 'update' button
    var valueCheckboxes = [];

    //adding form structure to left-column to hold "interestTopics" array
    $("#interest-category-form").append("<fieldset id='interest-fieldset'></fieldset>");
    $("#interest-fieldset").append("<legend id='legend'>Update your interests:</legend>");

    //for loop to generate interest topics as checkboxes on left column on page load
    for (let i = 0; i < interestTopics.length; i++) {
        var interestTopic = $("<input type='checkbox' name='interest-topic' class='checkbox'>")
        interestTopic.attr("value", interestTopics[i]);
        interestTopic.attr("id", interestTopics[i]);
        var interestTopicLabel = $("<label></label><br>")
        interestTopicLabel.attr("for", interestTopics[i]);
        interestTopicLabel.text(interestTopics[i]);
        $("#interest-fieldset").append(interestTopic);
        $("#interest-fieldset").append(interestTopicLabel);
    }
    $("#interest-fieldset").append("<input type='submit' id='update-button' value='Update'/>");


    //take the value of checked checkboxes and save to firebase by user on click of 'save' button
    $("#update-button").on("click", function (event) {
        event.preventDefault();

        userName = $(this).attr("data-id");

        //runs to save checked checkboxes to an array to store in database
        saveCheckboxValue();

        database.ref("userNames/").child(userName).update({    //this is overwriting bookshelf once clicked, how to  target just preferences key??
            preferences: valueCheckboxes
        });

        databaseSnapshotToPage();

        //clear checkboxes after save is clicked
        $(".checkbox").prop("checked", false);
    });

    // to retrive value of all checked checkboxes:
    function saveCheckboxValue() {

        //clear valueCheckboxes to update database each time save button is clicked
        valueCheckboxes = [];
        var checkboxes = document.getElementsByName("interest-topic");

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                value = checkboxes[i].value;
                valueCheckboxes.push(value);
            }
        }
    }

    //signup new users
    $("#sign-up-button").click(function (event) {
        event.preventDefault();

        //storing user email and password and displayName
        var newUserEmail = $("#signup-email").val().trim();
        var newUserPassword = $("#signup-password").val().trim();
        var newUserDisplayName = $("#signup-display-name").val().trim();

        //save to firebase in authentication
        auth.createUserWithEmailAndPassword(newUserEmail, newUserPassword)
            .then(userCred => {
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    // must use something other than email to reference user's data from database, displayName is a field in authentication object
                    displayName: newUserDisplayName
                });
            });

        //clear text
        $("#signup-display-name").val("");
        $("#signup-email").val("");
        $("#signup-password").val("");

        // close modal
        $(".modal").modal('hide');
    });


    //login existing users
    $("#login-button").click(function (event) {
        event.preventDefault();

        //capture user login email and password
        var userEmail = $("#login-email").val().trim();
        var userPassword = $("#login-password").val().trim();

        auth.signInWithEmailAndPassword(userEmail, userPassword)
            .then(userCred => {
                //display user preferences & bookshelf??
                //display user name as logged in
            });

        //clear text
        $("#login-email").val("");
        $("#login-password").val("");

        //close modal
        $(".modal").modal('hide');

        $("#current-preferences").show();
    });

    //logout button
    $("#logout").click(function (event) {
        event.preventDefault();
        auth.signOut();
        $("#user-logged-in").text(" ");
        $("#current-preferences").text(" ");
        $("#current-preferences").hide();
    });


    //shelf functions below

    //updates the bookShelf div from scratch whenever you call it,  called from onclick add favorite/read/toRead and onLoad firebase
    function updateShelf() {
        $("#bookShelf").empty();
        $("#bookShelf").append("<p>Favorite: <strong>" + favorite + "</strong></p>");
        $("#bookShelf").append("<p>Last Read: <strong>" + read + "</strong></p>");
        $("#bookShelf").append("<p>Next to Read: <strong>" + toRead + "</strong></p>");
    }


    // with cards loaded in middle column, user clicks "add" to: favorites, read, toRead buttons, updates userName node in fireBase
    $("#middle-column").on("click", ".card", function (e) {
        event.preventDefault();
        if (!userName) return;                  // can't add to 
        var thisId = e.target.attributes.getNamedItem("id").textContent;
        console.log(thisId);
        switch (thisId.slice(0, 1).toLowerCase()) {
            case "f": {
                var cardId = "#card-title" + thisId.replace("favorite", "");
                favorite = $(cardId).text();
                console.log("card ID", cardId);
                console.log("card-title: ", $(cardId).text());
                console.log("onclick card user: ", userName);
                database.ref("userNames/").child(userName).update({
                    favorite
                });
                updateShelf();
                break;
            }
            case "t": {
                var cardId = "#card-title" + thisId.replace("toRead", "");
                toRead = $(cardId).text();
                database.ref("userNames/").child(userName).update({
                    toRead
                });
                updateShelf();
                break;
            }
            case "r": {
                var cardId = "#card-title" + thisId.replace("read", "");
                read = $(cardId).text();
                database.ref("userNames/").child(userName).update({
                    read
                });
                updateShelf();
                break;
            }
        }

    });


$("#searchSuc").on("click", function (event) {
    event.preventDefault();

    $("#middle-column").empty();
    

    // user input to search bar
    userSearchTopic = $("#searchSucInput").val().trim();
    console.log(userSearchTopic);
    search(userSearchTopic);

    $("#searchSucInput").val("");

});

 

// API Key
var key = "Ct9FFohzvoH1NHCQ7TzXQ";

//Function to Search by ISBN, Author, and Title
function search(search) {
  var queryURL =
    "https://cors-anywhere.herokuapp.com/" +
    "https://www.goodreads.com/search/index.xml?key=" +
    key +
    "&q=" +
    search;
  var requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  fetch(queryURL, requestOptions)
    .then(response => response.text())
    //.then(result => console.log(result))
    .then(result => {
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(result, "text/xml");

      // Number of search results returned
      var searchLength = 5;

      //List 10 Titles from the Search Results
      for (let index = 0; index < searchLength; index++) {

        // Div for each Book
        var div = $("<div class='card' id='card-body'>");
        // Image tag each Book
        var img = $("<img class='card-img-top' alt='no picture available'>");
        // Title tag for each Book
        var pTitle = $("<p class='card-title'>");
        // Author tag for each Book
        var pAuthor = $("<p class='card-text'>");

        var favoriteButton = $("<button>Favorite</button>");
        var readButton = $("<button>Did Read</button>");
        var willReadButton = $("<button>Will Read</button>");

        var buttonDiv = $('<div class="buttonDiv">');
        buttonDiv.append(favoriteButton);
        buttonDiv.append(readButton);
        buttonDiv.append(willReadButton);
        // Title
        var bookTitle = xmlDoc
            .getElementsByTagName("search")[0]
            .getElementsByTagName("results")[0]
            .getElementsByTagName("work")[index]
            .getElementsByTagName("best_book")[0]
            .getElementsByTagName("title")[0].childNodes[0].nodeValue;

        // Author
        var bookAuthor = xmlDoc
            .getElementsByTagName("search")[0]
            .getElementsByTagName("results")[0]
            .getElementsByTagName("work")[index]
            .getElementsByTagName("best_book")[0]
            .getElementsByTagName("author")[0]
            .getElementsByTagName("name")[0].childNodes[0].nodeValue;

        // Image
        var imageLink = xmlDoc
            .getElementsByTagName("search")[0]
            .getElementsByTagName("results")[0]
            .getElementsByTagName("work")[index]
            .getElementsByTagName("best_book")[0]
            .getElementsByTagName("image_url")[0].childNodes[0].nodeValue;    

            
        // Place text inside divs
        pTitle.html(bookTitle);
        pAuthor.html(bookAuthor);

        favoriteButton.attr("id", "favorite" + index.toString());
        readButton.attr("id", "read" + index.toString());
        willReadButton.attr("id", "toRead" + index.toString());

        pTitle.attr("id", "card-title" + index.toString())


        // Placement of text inside inside BookDiv for each result
        img.attr("src", imageLink);
        div.append(img);
        div.append(buttonDiv);
        div.append(pTitle);
        div.append(pAuthor);
        div.addClass("resultDiv");
        
        $("#middle-column").prepend(div);
    }
    
    // Log search entire search result
    console.log("IMPORTANT:", xmlDoc);
    
    })
    .catch(error => console.log("error", error));
}



});

