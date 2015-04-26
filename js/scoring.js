function DataSource(url, name, weight) {
    var curObj = this;
    this.name = name;
    this.url = url;
    this.data = d3.map();
    this.weight = weight;
    this.get_normalized_data = function(arr, arr_size) {
        if (!curObj.data.has(arr)) return 0;

        var max = d3.max(curObj.data.values());
        return (curObj.data.get(arr)/arr_size)*100/(max/arr_size);
    };

    this.get_weighted_data = function(arr, arr_size) {
        return curObj.get_normalized_data(arr, arr_size)*curObj.weight;
    };

    d3.json(curObj.url, function (error, json) {
        if (error) return console.warn(error);
        curObj.data = d3.map(json[0]);
    });
}

var data_sources = [new DataSource('http://hackathon.cloudops.net/data.json', 'Swiming pools',  1),
                    new DataSource('http://hackathon.cloudops.net/data/patinoires.json', 'Skating rinks', 1),
                    new DataSource('http://hackathon.cloudops.net/policiers', 'Police station', 1),
                    new DataSource('http://hackathon.cloudops.net/bixis', 'Bixi station', 1),
                    new DataSource('http://hackathon.cloudops.net/pompiers', 'Fire station', 1),
                    new DataSource('http://hackathon.cloudops.net/eaux', 'Water station', 1),
                    new DataSource('http://hackathon.cloudops.net/bicycles', 'Bicycles Anchor', 1),
                    new DataSource('http://hackathon.cloudops.net/familles', 'Family stuff', 1),
                    new DataSource('http://hackathon.cloudops.net/arbres','Trees', 1)]

function add_data_source(url, name, weight) {
    data_sources[data_sources.length] = new DataSource(url, name, weight);
}

function get_arr_score(arr, arr_size) {
    ret = 0;
    for (var i = 0; i < data_sources.length; i++) {
        ret += data_sources[i].get_weighted_data(arr, arr_size);
    }
    return ret/data_sources.length;
}

function remove_datasource(url) {
    $("#datasource-modal-form .form-inline").each(function (index) {
        var elt = $(this).children("input[name='url']");
        if (elt.value == url) {
            $(this).remove();
        }
    });

    for (var i = 0; i < data_sources.length; i++) {
        if (data_sources[i].url == url) {
            data_sources.splice(i, i);
            break;
        }
    }
}

function load_initial_forms() {
    var elt = $("#datasource-modal-form");
    for (var i = 0; i < data_sources.length; i++) {
        html = '<div class="form-inline">';
        html += '<input type="text" placeholder="Name" value="'+data_sources[i].name+'" readonly>';
        html += '<input type="text" name="url" placeholder="URL" value="'+data_sources[i].url+'" readonly>';
        html += '<input type="text" placeholder="Weight" value="'+data_sources[i].weight+'" readonly>';
        html += '<button type="button" onclick="remove_datasource(\''+data_sources[i].url+'\')"><span class="glyphicon glyphicon-remove-sign"></span></button>';
        html += '</div>';
        elt.append(html);
    }
}
