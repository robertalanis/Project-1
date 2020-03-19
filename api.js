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
      var searchLength = 3;

      //List 10 Titles from the Search Results
      for (let index = 0; index < searchLength; index++) {

        // Div for each Book
        var div = $("<div>");
        // Image tag each Book
        var img = $("<img>");
        // Title tag for each Book
        var pTitle = $("<p>");
        // Author tag for each Book
        var pAuthor = $("<p>");

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

            
        // Place results inside p tags with class names
        pTitle.html(bookTitle);
        pTitle.addClass("title")
        pAuthor.html(bookAuthor)
        pAuthor.addClass("author")

        // Placement of text inside inside BookDiv for each result
        img.attr("src", imageLink);
        div.append(img);
        div.append(pTitle);
        div.append(pAuthor);
        
        // Asign div class resultDiv and prepend to each div
        div.addClass("resultDiv");
        $(".bookDiv").prepend(div);
    }
    
    // Log search entire search result
    console.log("IMPORTANT:", xmlDoc);
    
    })
    .catch(error => console.log("error", error));
}

// Test Searches

//search(9780439554930); // Harry Potter and the Sorcerer's Stone
//search("Call_Me_By_Your_Name") // Call me By Your Name
//search("Dan_Brown") // Dan Brown
search("Stephen_King") //Stephen King
//search("Science_Fiction") //Science Ficiton