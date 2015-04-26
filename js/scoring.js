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
    for (var i = 0; i < data_sources.length; i++) {
        ret += data_sources[i].get_weighted_data(arr);
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
