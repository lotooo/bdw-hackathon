var initial_sources = {'Swiming pools': 'http://hackathon.cloudops.net/data.json'}
var data_sources = []

function DataSource(url, name) {
    this.name = name;
    this.url = url;
    this.data = d3.map();
    this.get_normalized_data = function() {
        var ret = {};
        var max = d3.max(data.values());

        for (k in this.data)
            ret[k] = this.data.k*100/max;

        return ret;
    };
}

function load_data() {
    for (name in initial_sources){
        var ds = new DataSource(initial_sources[name], name);
        d3.json(ds.url, function (error, json) {
            if (error) return console.warn(error);
            ds.data = d3.map(json[0]);
        });
        data_sources[data_sources.length] = ds;
    }    
}
