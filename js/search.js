var nodes = null;
var edges = null;
var id = 1;
var init = false;
var c = false;

function run() {
    var term = $("#search").val();
    getXML(term, id, process);

}

function process(result, fromId, term) {
    if (init === false) {
        nodes = [{ id: id, value: 1, label: term }]; // Initialize nodes and edges structures
        edges = [{ from: id, to: (id + 1), value: 5 }];
    }
    var count = 5;
    $(result).find("CompleteSuggestion").each(function() { // For each suggestion
        if (count == 0)
            return false;
        var row = $(this).find('suggestion')[0]; // Grab suggestion
        var data = row.getAttribute('data');
        var firstIndex = data.indexOf(term);
        if (firstIndex == data.lastIndexOf(term) && firstIndex != -1) { // Check if term contains itself
            firstIndex = data.indexOf(" vs ");
            if (firstIndex == data.lastIndexOf(" vs ") && firstIndex != -1) { // Check if term contains more than one "vs"
                var split = data.split(" ");
                if (split.length == 3) { // Ensure there are only two terms
                    id++;
                    count--;
                    nodes.push({ id: id, value: 1, label: split[2] }); // Add element to nodes
                    //$("#div1").html($("#div1").html() + data + "<br>");
                    if (init == true) {
                        edges.push({ from: fromId, to: id, value: count });
                    } else
                        init = true;

                    console.log(count);
                }
            } else
                console.log("PURGING [" + data + "] REASON: repeated vs");
        } else
            console.log("PURGING [" + data + "] REASON: repeated term");



    });
    if (c === false) {
        c = true;
        console.log("Triggering continue");
        cont();
    }
    console.log("finished");
}

function cont() {
    /*
    for (var i = 0; i < nodes.length; i++) {
        console.log("nodes output: " + nodes[i]["label"]);
    }*/
    for (var i = 0; i < nodes.length; i++) {
        getXML(nodes[i]["label"], nodes[i]["id"], process);
        console.log("xml loop done");
    }
    console.log("drawing");
    draw(nodes, edges);

}


function getXML(term, fromId, process) {

    var url = "https://cors-anywhere.herokuapp.com/http://suggestqueries.google.com/complete/search?&output=toolbar&gl=us&hl=en&q=" + term + "%20vs%20";
    $.ajax({
        url: url,
        dataType: "xml",
        success: function(result) {
            process(result, fromId, term)
        }
    });

}