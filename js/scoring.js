var initial_sources = {'Swiming pools': 'http://hackathon.cloudops.net/data.json'}
var data_sources = []

function DataSource(url, name) {
    var curObj = this;
    this.name = name;
    this.url = url;
    this.data = d3.map();
    this.get_normalized_data = function(arr) {
        var max = d3.max(curObj.data.values());
        return curObj.data.get(arr)*100/max;
    };
    d3.json(curObj.url, function (error, json) {
        if (error) return console.warn(error);
        curObj.data = d3.map(json[0]);
    });
}

function add_data_source(name, url) {
    data_sources[data_sources.length] = new DataSource(initial_sources[name], name);
}

function load_initial_data() {
    for (name in initial_sources){
        add_data_source(name, initial_sources[name]);
    }    
}
