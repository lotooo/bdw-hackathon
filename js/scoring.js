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

    d3.json(url, function (error, json) {
        if (error) return console.warn(error);
        this.data = d3.map(json[0]);
    });
}
