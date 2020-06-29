var nodes = null;
var edges = null;
var id = 1;
var init = false;
var existingNodes = [];

function run() {
    var term = $("#search").val(); // Grab search term
    var outerNodes = [{ id: 1, label: term }];
    cont(outerNodes);
    console.log("Continue");
    draw(nodes, edges);
}

function process(result, fromId, term) {
    var outerNodes = [];
    if (init === false) {
        nodes = [{ id: id, value: 1, label: term }]; // Initialize nodes and edges structures
        edges = [{ from: id, to: (id + 1), value: 5 }];
        existingNodes.push(term);
    }
    var count = 5;
    $(result).find("CompleteSuggestion").each(function() { // For each suggestion
        if (count == 0)
            return false;
        var row = $(this).find('suggestion')[0]; // Grab suggestion
        var data = row.getAttribute('data');
        var testTerm = " " + term;
        var firstIndex = data.indexOf(testTerm);
        if (firstIndex == data.lastIndexOf(testTerm) && firstIndex == -1) { // Check if term contains itself
            firstIndex = data.indexOf(" vs ");
            if (firstIndex == data.lastIndexOf(" vs ") && firstIndex != -1) { // Check if term contains more than one "vs"
                var split = data.split(" ");
                if (split.length == 3) { // Ensure there are only two terms
                    if (!existingNodes.includes(split[2])) { // Check if node already exists and do not create a new one if so
                        id++;
                        existingNodes.push(split[2]); // Track existing nodes
                        nodes.push({ id: id, value: 1, label: split[2] }); // Add element to nodes
                        console.log("Adding " + split[2] + " To outernodes");
                        outerNodes.push({ id: id, label: split[2] }); // Track outer nodes
                        if (init == true) {
                            console.log("Adding edge between " + term + " and " + split[2]);
                            edges.push({ from: fromId, to: id, value: count });
                        } else
                            init = true;
                    } else { // Add edge or update edge weight if a node already exists
                        var targetId;
                        var matchFound = false;
                        for (var i = 0; i < nodes.length; i++) { // Find id of existing node
                            if (nodes[i]["label"] == split[2]) {
                                targetId = i;
                                break;
                            }
                        }
                        for (var i = 0; i < edges.length; i++) { // Find existing edge and increase it's value if it exists
                            if ((edges[i]["from"] == targetId && edges[i]["to"] == fromId) || (edges[i]["from"] == fromId && edges[i]["to"] == targetId)) {
                                edges[i]["value"] = edges[i]["value"] + count;
                                matchFound = true;
                                break;
                            }
                        }
                        if (matchFound == false && fromId != targetId) { // If no match, add new edge
                            console.log("Adding edge between " + term + " and " + split[2]);
                            edges.push({ from: fromId, to: targetId, value: count });
                        }
                    }
                    count--;


                    console.log(count);
                }
            } else
                console.log("PURGING [" + data + "] REASON: repeated vs");
        } else
            console.log("PURGING [" + data + "] REASON: repeated term");


    });
    console.log("finished");
    return outerNodes;

}

async function cont(outerNodes) {
    for (var i = 0; i < outerNodes.length; i++) {
        console.log("OUTERNODES:" + outerNodes[i]["label"]);
    }

    // Loop through nodes, one-at-a-time
    for (const node of outerNodes) {
        // Make the HTTP request
        await fetch("https://cors-anywhere.herokuapp.com/http://suggestqueries.google.com/complete/search?&output=toolbar&gl=us&hl=en&q=" + node["label"] + "%20vs%20")
            .then(response => { // Parse data into text
                console.log("Node: " + node["label"]);
                return response.text();
            })
            .then(data => { // Parse text into xml and process
                var parser = new DOMParser();
                var xml = parser.parseFromString(data, "text/xml");
                process(xml, node["id"], node["label"]);
            })
    }

}

/* Deprecated
function getXML(term, fromId) {

    var url = "https://cors-anywhere.herokuapp.com/http://suggestqueries.google.com/complete/search?&output=toolbar&gl=us&hl=en&q=" + term + "%20vs%20";
    $.ajax({
        url: url,
        dataType: "xml",
        success: function(result) {
            var outerNodes = process(result, fromId, term);
            cont(outerNodes);
        }
    });

}
*/