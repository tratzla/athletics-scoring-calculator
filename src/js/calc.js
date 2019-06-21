



function setup_EventDD(){

    var radio_selections = $(".event_lookup .checkbox")
                                    .checkbox("is checked");
    var evt_dd = $('.event_lookup .ui.dropdown');

    var indoor_outdoor = radio_selections[0] ? "Outdoor" : "Indoor";
    var men_women = radio_selections[2] ? "Men" : "Women";

    var current_selection = evt_dd.dropdown('get text');

    keep_sel = false;
    var dd_values = [];
    console.log(dd_values);
    $.each(formulaConstants[indoor_outdoor][men_women], function(idx, event){
        keep_sel = current_selection == event.name;
        dd_values.push({
            name: event.name,
            value: `${indoor_outdoor};${men_women};${idx};${event.name}`,
            selected: keep_sel
        });
    });
    console.log(dd_values.length);
    if(!keep_sel && dd_values.length > 0) dd_values[0].selected = true;

    evt_dd.dropdown({
        values:dd_values,
        onChange:eventdd_changed
    });

}


function get_evt_data(value){
    if(!value) return false;
    var keys = value.split(';');
    var event_props = formulaConstants[keys[0]][keys[1]][keys[2]];
    //console.log(`event_props ${event_props.name} and ${keys[3]}`);
    //console.log(event_props);
    if(event_props.name != keys[3]){
        console.log("Unexpected events result")
        return false;
    }
    event_props.gender = keys[1];
    event_props.season = keys[0];

    return event_props;
}

function eventdd_changed(value, text, choice){
    console.log(value);
    event_props = get_evt_data(value);
    if(!event_props) return false;

    perf_validation(false);
    if(event_props.type == 'points'){
        $('.performance.form .field.points_perf').css('display', '');
        $('.performance.form .field.distance_perf').css('display', 'none');
        $('.performance.form .fields.time_perf').css('display', 'none');
        perf_validation(false, false, true);

    }
    if(event_props.type == 'time'){
        $('.performance.form .field.points_perf').css('display', 'none');
        $('.performance.form .field.distance_perf').css('display', 'none');
        $('.performance.form .fields.time_perf').css('display', '');
        perf_validation(false, true, false);
    }
    if(event_props.type == 'metres'){
        $('.performance.form .field.points_perf').css('display', 'none');
        $('.performance.form .field.distance_perf').css('display', '');
        $('.performance.form .fields.time_perf').css('display', 'none');
        perf_validation(true, false, false);

    }

}

function perf_validation(use_m, use_t, use_p){
    var perf_form = $('.performance.form');
    var evt_form  = $('.event_lookup.form');
    perf_form.form({});
    if(use_m){
        perf_form
            .form('add field', 'goal_metres', ['decimal']);
    }
    if(use_t){
        perf_form
            .form({onSuccess: function(event,fields){
                var h = parseFloat(perf_form.form("get value", "goal_hours"));
                var m = parseFloat(perf_form.form("get value", "goal_minutes"));
                var s = parseFloat(perf_form.form("get value", "goal_seconds"));
                if (isNaN(h) && isNaN(m) && isNaN(s) ){
                    perf_form
                        .form("add errors", ["At least one of Hours, Minutes, Seconds has to be filled"]);
                    return false;
                }
                evt_selected = evt_form.form('get value', 'dd_event');
                console.log(evt_selected);
                if(!evt_selected){
                    perf_form
                        .form("add errors", ["Select event for lookup"]);
                    return false;
                }
                return true;
            }

            })
            .form('add fields', {
                  goal_hours: {
                    identifier : 'goal_hours',
                    optional   : true,
                    rules: [{
                        type   : 'decimal',
                        prompt : '{name} should be a number or empty'
                      }]
                  },
                  goal_minutes: {
                    identifier : 'goal_minutes',
                    optional   : true,
                    rules: [{
                        type   : 'decimal',
                        prompt : '{name} should be a number or empty'
                      }]
                  },
                  goal_seconds: {
                    identifier : 'goal_seconds',
                    optional   : true,
                    rules: [{
                        type   : 'decimal',
                        prompt : '{name} should be a number or empty'
                      }]
                  }
            });

    }
    if(use_p){
        perf_form
            .form('add field', 'goal_points', ['number']);
    }
    perf_form.api({
        beforeSend: function(settings){
            points_lookup();
            return false;
        }
    });
}

function reverse_lookup(){
    var points_form = $('.points.form');
    var evt_form  = $('.event_lookup.form');
    var perf = 0;
    var points = 0;
    var perf_str = ''

    var evt_selected = evt_form.form('get value', 'dd_event');
    if(!evt_selected) return false;
    if(points_form.hasClass('error')) return false;

    event_props = get_evt_data(evt_selected);
    points = parseFloat(points_form.form("get value", "reverse_points"));
    perf = calc_performance(points, event_props);

    if(event_props.type == "time"){
        perf_str = build_time_str(secs_to_parts(perf));
    }
    if(event_props.type == "metres"){
        perf_str = perf.toLocaleString('en', {
                            minimumIntegerDigits:1,
                            minimumFractionDigits:2,
                            maximumFractionDigits:2,
                            useGrouping:false}) + 'm';
    }
    if(event_props.type == "points"){
        perf_str = Math.ceil(perf)+'';
    }
    console.log(`Perf for IAAF Points ${points} in ${event_props.name} are  ${perf_str}`);
    var newrow = $('<tr class="transition hidden">')
                    .append($('<td>').text(event_props.gender))
                    .append($('<td>').text(event_props.season))
                    .append($('<td>').text(event_props.name))
                    .append($('<td>').text(perf_str))
                    .append($('<td>').text(points));

    $('.results tbody').prepend(newrow);
    newrow.transition('glow');


}

function points_lookup(){
    var perf_form = $('.performance.form');
    var evt_form  = $('.event_lookup.form');
    var perf = 0;
    var points = 0;
    var perf_str = ''

    var evt_selected = evt_form.form('get value', 'dd_event');
    if(!evt_selected) return false;
    if(perf_form.hasClass('error')) return false;


    event_props = get_evt_data(evt_selected);


    if(event_props.type == "time"){
        var h = parseFloat(perf_form.form("get value", "goal_hours"));
        var m = parseFloat(perf_form.form("get value", "goal_minutes"));
        var s = parseFloat(perf_form.form("get value", "goal_seconds"));
        perf = 0;
        if(!isNaN(h)) perf +=  h*3600;
        if(!isNaN(m)) perf +=  m*60;
        if(!isNaN(s)) perf +=  s;
        perf_str = build_time_str(secs_to_parts(perf));
    }
    if(event_props.type == "metres"){
        perf = parseFloat(perf_form.form("get value", "goal_metres"));
        perf_str = perf.toLocaleString('en', {
                            minimumIntegerDigits:1,
                            minimumFractionDigits:2,
                            maximumFractionDigits:3,
                            useGrouping:false}) + 'm';
    }
    if(event_props.type == "points"){
        perf = parseFloat(perf_form.form("get value", "goal_points"));
        perf_str = perf + '';
    }
    points = calc_points(perf,event_props);
    console.log(`IAAF Points for perf: ${perf} in ${event_props.name} are ${points}`);
    var newrow = $('<tr class="transition hidden">')
                    .append($('<td>').text(event_props.gender))
                    .append($('<td>').text(event_props.season))
                    .append($('<td>').text(event_props.name))
                    .append($('<td>').text(perf_str))
                    .append($('<td>').text(points));

    $('.results tbody').prepend(newrow);
    newrow.transition('glow');

}

function calc_points(perf, event_props){
    //check slope to verify valid part of regression function
    var slope = 0;
    slope = 2*event_props.a*perf+2*event_props.a*event_props.b;
    //console.log(`Slope: ${slope}`);
    if(slope > 0 && event_props.type == "time"){
        ret = "0 (off tables)";
    }else if (slope < 0 && event_props.type != "time"){
        ret = "0 (off tables)";
    }else{
        var raw_points = event_props.a *  Math.pow(perf + event_props.b, 2) + event_props.c;
        var ret = ""
        if(raw_points> 1400){
            ret = "1400+ (off tables)";
        }else if(raw_points < 0){
            ret = "0";
        }else{
            ret = Math.trunc(raw_points)
        }
    }
    return ret
}

function calc_performance(points, event_props){
        // Find root of a*x^2+b*x+[c-points]
        //var cRoot = event_props.c - points;
        //var discriminant = Math.pow(event_props.b,2) - 4*event_props.a*cRoot;
        //if (discriminant < 0) {
        //    throw new NumberFormatException("Points give a non-real performance. Are the constants correct?");
        //}

        //return (-event_props.b+Math.sqrt(discriminant))/(2*event_props.a);
        var discriminant = (points-event_props.c)/event_props.a
        if (discriminant < 0) {
            throw new NumberFormatException("Points give a non-real performance. Are the constants correct?");
        }
        var plus = -event_props.b-Math.sqrt(discriminant);
        var minus = -event_props.b+Math.sqrt(discriminant);
        var ret = "?";

        if(plus > 0) ret = plus;
        if(minus > 0) ret = minus;
        if(plus > 0 && minus > 0){
            if(plus > minus) ret = minus;
            if(minus > plus) ret = plus;
        }
        console.log(`Found perf: ${minus} and ${plus}`);

        return ret;


}

$(document).ready(function() {
    download_constants(setup_EventDD);
    var perf_form   = $('.performance.form');
    var points_form = $('.points.form');
    var evt_form  = $('.event_lookup.form');

    $('.ui.tabular.menu .item').tab();


    $('.event_lookup .checkbox').checkbox()
        .checkbox({
            onChange: setup_EventDD
        });

    $('.button.clear').click(function(e){
        perf_form.removeClass('error');
        points_form.removeClass('error');
    });

    $('#clear_points_table').click(function(){
        $('.results tbody').html("");
    });

    //setup_EventDD();
    points_form.api({
        beforeSend: function(settings){
            points_lookup();
            return false;
        }
    });

    console.log("REAY!");
    points_form.form({
        fields: {
          reverse_points: ['empty', 'number']
        },
        onSuccess: function(event,fields){
            var points = parseFloat(points_form.form("get value", "reverse_points"));
            if (points<0 || points > 2500 ){
                points_form
                    .form("add errors", ["Tables are only valid for points between 0 and 1400"]);
                return false;
            }
            evt_selected = evt_form.form('get value', 'dd_event');
            console.log(evt_selected);
            if(!evt_selected){
                points_form
                    .form("add errors", ["Select event for lookup"]);
                return false;
            }
            reverse_lookup();
            return true;
        }
      }).api({
          beforeSend: function(settings){

              return false;
          }
      });



});
