var map;

queue()
    .defer(d3.json, 'data/montreal.json')
    .await(makeMap)


function makeMap(error, gjson_1) {

    function matchKey(datapoint){
        return(parseFloat(get_arr_score(datapoint.ABREV, (datapoint.AIRE/1000000))));
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
        click: getMoreInfo

	    });
    }

    function getMoreInfo(e){
        var layer = e.target;

        info.getInfo(layer.feature.properties);

    };

    info.getInfo = function(props){
        console.log(props.ABREV);

    }

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        var html = "";
        if (!props) {
           html = '<h4>Mouse over an arrondissement</h4>';
        } else { 
            html =  '<h4>' +  props.NOM + '</h4>';
            html += "<br /><span class='i_title'>Code</span> : " + props.ABREV;
            html += "<br /><span class='i_title'>Surface : </span>" + (props.AIRE / 1000000).toFixed(2) + " km<sup>2</sup>";
            for (var i = 0; i < data_sources.length; i ++) {
                html += "<br /><span class='i_title'>"+data_sources[i].name+": </span>" + data_sources[i].data.get(props.ABREV);
            }
            html += "<br /><span class='i_title'>Score : </span>" + get_arr_score(props.ABREV, (props.AIRE / 1000000)).toFixed(2);
        }
        this._div.innerHTML = html;
    };

    var color = d3.scale.threshold()
              .domain([0.0, 10.0, 20.0, 30.0, 40.0, 70.0, 100.0])
              .range(['#CC0000','#F03217', '#F56F0F', '#FFED00','#FEE901', '#8ED103', '#52C004', '#00A806']);

    var southWest = L.latLng(45, -73.701),
    northEast = L.latLng(46, -73.699),
    bounds = L.latLngBounds(southWest, northEast);
    map = L.map('map', {minZoom:11, maxZoom:11, dragging : false}).setView([45.55, -73.7], 11);

    info.addTo(map)

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data (c) <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    function style_1(feature) {
	    return {
		fillColor: color(matchKey(feature.properties)),
		weight: 1,
		opacity: 0.8,
		color: 'grey',
		fillOpacity: 0.8
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
    .domain([0, 100])
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
        .text('Arrondissement likelyness');


};

