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
    .then(result => {
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(result, "text/xml");
      var Title = xmlDoc
        .getElementsByTagName("search")[0]
        .getElementsByTagName("results")[0]
        .getElementsByTagName("work")[0]
        .getElementsByTagName("best_book")[0]
        .getElementsByTagName("title")[0].childNodes[0].nodeValue;
      console.log("First Search Result Title:", Title);

      //List 10 Titles from the Search Results
      for (let index = 0; index < 10; index++) {
        var searchResult = xmlDoc
            .getElementsByTagName("search")[0]
            .getElementsByTagName("results")[0]
            .getElementsByTagName("work")[index]
            .getElementsByTagName("best_book")[0]
            .getElementsByTagName("title")[0].childNodes[0].nodeValue;
        console.log("Book ", index+1, ": ", searchResult);
    }
    
      console.log("IMPORTANT:", xmlDoc);
    })
    .catch(error => console.log("error", error));
}

search(9780439554930); // Harry Potter and the Sorcerer's Stone
search("Call_Me_By_Your_Name") // Call me By Your Name
search("Dan_Brown") // Dan Brown
search("Stephen_King") //Stephen King
search("Science_Fiction") //Science Ficiton