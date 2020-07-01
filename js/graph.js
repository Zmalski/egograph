var nodes = null;
var edges = null;
var network = null;

function draw(nodes, edges) {

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i]["value"] == 1) {
            nodes[i]["color"]["background"] = "#63B0CF";
            nodes[i]["color"]["border"] = "#358AAC";
        } else if (nodes[i]["value"] == 2) {
            nodes[i]["color"]["background"] = "#C2925B";
            nodes[i]["color"]["border"] = "#956937";
        } else if (nodes[i]["value"] == 3) {
            nodes[i]["color"]["background"] = "#F2502C";
            nodes[i]["color"]["border"] = "#C02D0C";
        } else if (nodes[i]["value"] == 4) {
            nodes[i]["color"]["background"] = "#BEE675";
            nodes[i]["color"]["border"] = "#9ED930";
        } else if (nodes[i]["value"] == 5) {
            nodes[i]["color"]["background"] = "#8533D7";
            nodes[i]["color"]["border"] = "#5C1E99";
        } else if (nodes[i]["value"] == 6) {
            nodes[i]["color"]["background"] = "#F877C0";
            nodes[i]["color"]["border"] = "#F42A9C";
        } else if (nodes[i]["value"] > 6) {
            nodes[i]["color"]["background"] = "#9E84AE";
            nodes[i]["color"]["border"] = "#765988";
        }
    }

    var container = document.getElementById("mynetwork");
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: "dot",
            scaling: {
                label: {
                    min: 10,
                    max: 18
                },
                min: 10,
                max: 24
            },
            font: {
                size: 12,
                face: "Tahoma"
            }
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -30,
                centralGravity: 0.007,
                springLength: 180,
                springConstant: 0.25
            },
            solver: "forceAtlas2Based"
        },
        edges: {
            color: {
                color: "#757575",
                highlight: "#ff0000",
                opacity: 0.5
            },
            smooth: {
                enabled: true,
                type: "dynamic"
            }
        }
    };
    network = new vis.Network(container, data, options);

    /*
    network.on("stabilizationProgress", function(params) { // For Loading
        var maxWidth = 496;
        var minWidth = 20;
        var widthFactor = params.iterations / params.total;
        var width = Math.max(minWidth, maxWidth * widthFactor);

        document.getElementById("bar").style.width = width + "px";
        document.getElementById("text").innerHTML =
            Math.round(widthFactor * 100) + "%";
    });
    network.once("stabilizationIterationsDone", function() { // For loading
        document.getElementById("text").innerHTML = "100%";
        document.getElementById("bar").style.width = "496px";
        document.getElementById("loadingBar").style.opacity = 0;
        // really clean the dom element
        setTimeout(function() {
            document.getElementById("loadingBar").style.display = "none";
        }, 500);
    });*/
}