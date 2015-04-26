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

function remove_datasource() {
    $(this).parent().remove();
}

function create_add_button() {
    html = '<button class="form-control" type="button"><span class="glyphicon glyphicon-plus-sign"></span></button>';
    var btn = $.parseHTML(html);
    $(btn).click(add_datasource);
    return btn;
}

function create_delete_button() {
    html = '<button class="form-control" type="button"><span class="glyphicon glyphicon-remove-sign"></span></button>';
    var btn = $.parseHTML(html);
    $(btn).click(remove_datasource);
    return btn;
}

function create_data_source_widget(ds) {
    container = $.parseHTML('<div class="form-inline">');
    var name = $.parseHTML('<input class="form-control" type="text" name="name" placeholder="Name">');
    if (ds)
        $(name).val(ds.name);
    var url = $.parseHTML('<input class="form-control" type="text" name="url" placeholder="URL">');
    if (ds)
        $(url).val(ds.url);
    var weight = $.parseHTML('<input class="form-control" type="text" name="weight" placeholder="Weight">');
    if (ds)
        $(weight).val(ds.weight);

    if (ds)
        btn = create_delete_button();
    else
        btn = create_add_button();

    $(container).append(name);
    $(container).append(url);
    $(container).append(weight);
    $(container).append(btn);
    return container;
}

function add_datasource() {
    var parentelt = $(this).parent();
    parentelt.after(create_data_source_widget());
    $(this).children('span').removeClass('glyphicon-add-sign');
    $(this).children('span').addClass('glyphicon-remove-sign');
    $(this).off('click');
    $(this).click(remove_datasource);
}

function modal_save_changes() {
    data_sources = [];
    var elt = $("#datasource-modal-form .form-inline");
    elt.each(function (index) {
        var name = "";
        var url = "";
        var weight = 0;
        $(this).children("input[type='text']").each(function (index) {
            if ($(this).attr('name') == 'name')
                name = $(this).val();
            if ($(this).attr('name') == 'url')
                url = $(this).val();
            if ($(this).attr('name') == 'weight')
                weight = $(this).val();
        });
        if (name != '' && url != '' && weight != '')
            data_sources[data_sources.length] = new DataSource(url, name, parseFloat(weight));
    });
    $("#myModal").modal('hide');
}

function load_initial_forms() {
    var elt = $("#datasource-modal-form");
    for (var i = 0; i < data_sources.length; i++) {
        elt.append(create_data_source_widget(data_sources[i]));
    }
    elt.append(create_data_source_widget());
    $("#modal-save-changes").click(modal_save_changes);
}
