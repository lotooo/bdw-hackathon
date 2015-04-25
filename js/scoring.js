var initial_sources = {'Swiming pools': 'http://hackathon.cloudops.net/data.json'}
var data_sources = []

function DataSource(url, name) {
    this.name = name;
    this.url = url;
    this.data = d3.map();
    this.get_normalized_data = function(arr) {
        var max = d3.max(this.data.values());
        return this.data[arr]*100/max;
    };
}

function add_data_source(name, url) {
    var ds = new DataSource(initial_sources[name], name);
    d3.json(ds.url, function (error, json) {
        if (error) return console.warn(error);
        ds.data = d3.map(json[0]);
    });
    data_sources[data_sources.length] = ds;
}

function load_initial_data() {
    for (name in initial_sources){
        add_data_source(name, initial_sources[name]);
    }    
}
