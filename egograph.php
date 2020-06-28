<!DOCTYPE html>
<html>

<head>
    <title>
        EgoGrapher
    </title>
    <meta name="viewport" content="width=device-width; initial-scale=1.0">
    <link rel="stylesheet" href="css/graph.css">
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <script src="http://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="js/search.js"></script>
    <script type="text/javascript" src="js/graph.js"></script>
    <script type="text/javascript">
        window.jQuery ||
            document.write('<script src="js/jquery-3.1.1.min.js"><\/script>');
    </script>
</head>

<body>
    <div class="search">
        <form>
            <input type="text" placeholder="Search" id="search" />
            <button type="button" onclick="javascript:run()">Search</button>
        </form>
    </div>
    <div id="div1">

    </div>
    <div id="div2">

    </div>
    <div id="mynetwork">

    </div>

    </div>
</body>

</html>