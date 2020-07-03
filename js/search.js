var nodes = null;
var edges = null;
var id = 0;
var init = false;
var existingNodes = [];
const radius = 4;
const defEdgeWeight = 25;
const maxWeight = 11;

$(document).ready(function() { // Detect enter key press on search function
    $("#search").on('keyup', function(e) {
        if (e.keyCode === 13) {
            run();
        }
    });
    $(".error-text").hide(0);
    $('[data-toggle="tooltip"]').tooltip();
});

function run() {
    if (validateTerm() === true) {
        $(".progress").removeAttr("hidden"); // Reset loading bar
        $(".progress").show();
        $(".progress-bar").removeClass("bg-success");
        nodes = [];
        edges = [];
        existingNodes = [];
        id = 0;
        init = false;
        if (screen.width > 769)
            $("#mynetwork").height("45rem");
        else if (screen.width > 993)
            $("#mynetwork").height("35rem");
        else
            $("#mynetwork").height("27rem");
        var term = $("#search").val(); // Grab search term
        var outerNodes = [{ id: id, label: term }];
        cont(outerNodes, function() { // Callback for sequentiality
            //console.log("Drawing");
            draw(nodes, edges);
        });
    }

}

function process(result, fromId, term) {
    var outerNodes = [];
    if (init === false) {
        nodes = [{ id: fromId, value: 1, label: term, color: { background: "#D2E5FF", border: "#000000" } }]; // Initialize nodes and edges structures
        edges = [];
        existingNodes.push(term);
        init = true;
    }
    var count = 5;
    $(result).find("CompleteSuggestion").each(function() { // For each suggestion
        if (count == 0)
            return false;
        if (init === false)
            count--;
        var row = $(this).find('suggestion')[0]; // Grab suggestion
        var data = row.getAttribute('data');
        var testTerm = " " + term;
        var firstIndex = data.indexOf(testTerm);
        if (firstIndex == data.lastIndexOf(testTerm) && firstIndex == -1) { // Check if term contains itself
            firstIndex = data.indexOf(" vs ");
            if (firstIndex == data.lastIndexOf(" vs ") && firstIndex != -1) { // Check if term contains more than one "vs"
                var split = data.split(" ");
                if (split.length == 3) { // Ensure there are only two terms
                    if (existingNodes.includes(split[2]) || existingNodes.includes((split[2] + "s")) || (existingNodes.includes(split[2].slice(0, -1)) && split[2].slice(-1) === "s")) { // Check if node already exists and do not create a new one if so, otherwise add/update edge
                        var newTerm = "";
                        //console.log("old term " + split[2]);
                        if (existingNodes.includes((split[2] + "s"))) { // If original term was plural and new term is singular, make new term singular
                            newTerm = split[2] + "s";
                        } else if (existingNodes.includes(split[2].slice(0, -1))) { // If original term was singular and new term is plural, make new term plural
                            newTerm = split[2].slice(0, -1);
                        } else {
                            newTerm = split[2];
                        }
                        //console.log("new Term " + newTerm)
                        var targetId;
                        var matchFound = false;
                        for (var i = 0; i < nodes.length; i++) { // Find id of existing node
                            if (nodes[i]["label"] == newTerm) {
                                targetId = i;
                                break;
                            }
                        }
                        for (var i = 0; i < edges.length; i++) { // Find existing edge and increase it's value if it exists
                            if ((edges[i]["from"] == targetId && edges[i]["to"] == fromId)) {
                                edges[i]["value"] = edges[i]["value"] + count;
                                var origWeight = maxWeight - (edges[i]["length"] / defEdgeWeight);
                                var newWeight = (maxWeight - (origWeight + count)) * defEdgeWeight;
                                edges[i]["length"] = newWeight;
                                nodes[fromId]["value"] = nodes[fromId]["value"] + 1; // Increment node value due to new inbound connection
                                matchFound = true;
                                //console.log("Updating edge between " + fromId + " and " + targetId);
                                break;
                            }
                            /*else if ((edges[i]["from"] == fromId && edges[i]["to"] == targetId)) {
                                                           console.log("THAT: " + term + " to " + split[2]);
                                                       }*/
                        }
                        if (matchFound == false && fromId != targetId) { // If no match, add new edge
                            //console.log("Adding edge between " + term + " and " + split[2]);
                            nodes[targetId]["value"] = nodes[targetId]["value"] + 1; // Increment node value due to new inbound connection
                            edges.push({ from: fromId, to: targetId, value: count, length: ((maxWeight - count) * defEdgeWeight) });
                            //console.log("Adding edge between " + fromId + " and " + targetId);
                        }

                    } else { // Add new node
                        id++;
                        if (id < 81) { // Update loading bar up to 80%, drawing will take the rest, should give good feedback
                            $(".progress-bar").css("width", id + "%");
                            $(".progress-bar").html(id + "%");
                        }
                        existingNodes.push(split[2]); // Track existing nodes
                        nodes.push({ id: id, value: 1, label: split[2], color: { background: "#D2E5FF", border: "#000000" } }); // Add element to nodes
                        //console.log("Adding " + split[2] + " To outernodes");
                        outerNodes.push({ id: id, label: split[2] }); // Track outer nodes
                        edges.push({ from: fromId, to: id, value: count, length: ((maxWeight - count) * defEdgeWeight) });
                        //console.log("Adding edge between " + fromId + " and " + id);
                    }
                    count--;


                    //console.log(count);
                }
            } //else
            //console.log("PURGING [" + data + "] REASON: repeated vs");
        } //else
        //console.log("PURGING [" + data + "] REASON: repeated term");


    });
    //console.log("finished");
    return outerNodes;

}

async function cont(outerNodes, callback) {


    // Loop through nodes, one-at-a-time
    for (var i = 0; i < radius; i++) {

        for (const node of outerNodes) {
            // Make the HTTP request
            await fetch("https://cors-anywhere.herokuapp.com/http://suggestqueries.google.com/complete/search?&output=toolbar&gl=us&hl=en&q=" + node["label"] + "%20vs%20")
                .then(response => { // Parse data into text
                    //console.log("Node: " + node["label"]);
                    return response.text();
                })
                .then(data => { // Parse text into xml and process
                    var parser = new DOMParser();
                    var xml = parser.parseFromString(data, "text/xml");
                    //console.log("Processing " + node["id"]);
                    outerNodes = outerNodes.concat(process(xml, node["id"], node["label"]));
                    outerNodes.shift(); // Get rid of term that was just processed
                })
        }
        /*for (var j = 0; j < outerNodes.length; j++) {
            console.log("OUTERNODES:" + outerNodes[j]["label"]);
        }*/
    }
    callback();

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

function validateTerm() { //Ensure user entered only one word
    var term = $("#search").val();
    if (term === "" || /\s/.test(term)) {
        $("#search").addClass("error");
        $(".error-text").removeAttr("hidden");
        $(".error-text").show(0);
        return false;
    } else {
        $("#search").removeClass("error");
        $(".error-text").hide(0);
        return true;
    }

}