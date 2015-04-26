function DataSource(url, name, weight) {
    var curObj = this;
    this.name = name;
    this.url = url;
    this.data = d3.map();
    this.weight = weight;
    this.get_normalized_data = function(arr) {
        var max = d3.max(curObj.data.values());
        return curObj.data.get(arr)*100/max;
    };

    this.get_weighted_data = function(arr) {
        return curObj.get_normalized_data(arr)*curObj.weight;
    };

    d3.json(curObj.url, function (error, json) {
        if (error) return console.warn(error);
        curObj.data = d3.map(json[0]);
    });
}

var data_sources = [new DataSource('http://hackathon.cloudops.net/data.json', 'Swiming pools',  1)]

function add_data_source(url, name, weight) {
    data_sources[data_sources.length] = new DataSource(url, name, weight);
}

function get_arr_score(arr) {
    ret = 0;
    for (var i = 0; i < data_source.length; i++) {
        ret += data_source[i].get_weighted_data(arr);
    }
    return ret/data_sources.length;
}
