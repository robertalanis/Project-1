function updateQuotes() {
    //file:///C:/Users/sb/OneDrive/Documents/BowlerConsulting/UTbootcamp/homework/Project-1/.../
    // required attribution link to be able to use the quote theysaidso.com

    var url = "http://quotes.rest/qod.json?category=inspire";

    $.ajax({ url, method: "GET" })
        .then(function (response) {
            // console.log(response);
            // console.log(response.contents.quotes[0]);
            // console.log(response.contents.quotes[0].quote);
            // console.log(response.contents.quotes[0].author);
            var quote = response.contents.quotes[0].quote;
            var author = response.contents.quotes[0].author;
            $("#right-column").empty();
            $("#right-column").append("<p>Quote of the day: <strong>" + quote + "</strong></p>");
            $("#right-column").append("<p>Author: <strong>" + author + "</strong></p>");
            $("#right-column").append("<p>Source: theysaidso.com </p>");

        }).catch(function (err) {
            console.log(err);
        }
        );


}