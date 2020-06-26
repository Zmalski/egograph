function run() {
    var term = $("#search").val();
    process(term);
}

function process(term) {
    var url = "https://cors-anywhere.herokuapp.com/http://suggestqueries.google.com/complete/search?&output=toolbar&gl=us&hl=en&q=" + term + "%20vs%20";
    console.log(url);
    $.ajax({
        url: url,
        dataType: "xml",
        success: function(result) {
            $(result).find("CompleteSuggestion").each(function() { // For each suggestion
                var row = $(this).find('suggestion')[0]; // Grab each suggestion
                var data = row.getAttribute('data');
                var firstIndex = data.indexOf(term);
                if (firstIndex == data.lastIndexOf(term) && firstIndex != -1) { // Check if term contains itself
                    firstIndex = data.indexOf(" vs ");
                    if (firstIndex == data.lastIndexOf(" vs ") && firstIndex != -1) { // Check if term contains more than one "vs"
                        $("#div1").html($("#div1").html() + data + "<br>");
                    } else
                        console.log("getting rid of " + data + " because of repeated vs");
                } else
                    console.log("getting rid of " + data + " because of repeated term");

                console.log(data);

            });
        }
    });
    $("#div2").html("processed");
}