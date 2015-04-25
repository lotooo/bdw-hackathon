queue()
    .defer(d3.json, 'http://hackathon.cloudops.net/data.json')
    .defer(d3.json, 'http://hackathon.cloudops.net/montreal.json')
    .await(makeMap)


function makeMap(error, data_1,gjson_1) {

    function matchKey(datapoint, key_variable){
        return(parseFloat(key_variable[0][datapoint]));
    };

    // Let's try to create a popu when the mouse is over an arrondissement
    var info = L.control();

    function highlightFeature(e) {
	    var layer = e.target;

	    layer.setStyle({
		weight: 8,
		color: '#6666CC',
		dashArray: '',
		fillOpacity: 1
	    });

	    if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	    }

	    info.update(layer.feature.properties);
    }


    function onEachFeature(feature, layer) {
	    layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
	    });
    }

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>' +  (props ? props.NOM + '</h4> <br />' + props.NUM + ' swimming pools'
            : 'Mouse over an arrondissemnt');
    };

    var color = d3.scale.threshold()
              .domain([10.0, 20.0, 30.0, 50.0, 50.0])
              .range(['#FFFFCC', '#D9F0A3', '#ADDD8E', '#78C679', '#41AB5D', '#238443']);


    var map = L.map('map', {minZoom:11, maxZoom:11}).setView([45.55, -73.7], 11);

    info.addTo(map)

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data (c) <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    function style_1(feature) {
	    return {
		fillColor: color(matchKey(feature.properties.ABREV, data_1)),
		weight: 1,
		opacity: 0.2,
		color: 'black',
		fillOpacity: 0.7
	    };
    }

    gJson_layer_1 = L.geoJson(gjson_1, {style: style_1, onEachFeature: onEachFeature}).addTo(map)

    function resetHighlight(e) {
	gJson_layer_1.resetStyle(e.target);
	info.update();
    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {var div = L.DomUtil.create('div', 'legend'); return div};

    legend.addTo(map);

    var x = d3.scale.linear()
    .domain([0, 50])
    .range([0, 400]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .tickSize(1)

    var svg = d3.select(".legend.leaflet-control").append("svg")
        .attr("id", 'legend')
        .attr("width", 450)
        .attr("height", 40);

    var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(25,16)");

    g.selectAll("rect")
        .data(color.range().map(function(d, i) {
          return {
            x0: i ? x(color.domain()[i - 1]) : x.range()[0],
            x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
            z: d
          };
        }))
      .enter().append("rect")
        .attr("height", 10)
        .attr("x", function(d) { return d.x0; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .style("fill", function(d) { return d.z; });

    g.call(xAxis).append("text")
        .attr("class", "caption")
        .attr("y", 21)
        .text('Public Swimming Pool Number ');


};

