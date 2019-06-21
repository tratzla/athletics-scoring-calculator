
formulaConstants={Indoor:{Women:[], Men:[]},
                  Outdoor:{Women:[], Men:[]}};

function wcap(str) {
    return (str.toLowerCase() + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}


function parse_formulas(results, file, indoor_outdoor, men_women) {
            //console.log("Parsing complete:", results, file);
            if(results.meta.aborted){
                console.log("problem getting data. Oops.");
                return;
            }

            $.each(results.data, function(idx, event){
                if(!event[0] || event[0] == "event") return true;

                var evt = event[0].replace(/_/g, ' ');
                evt = wcap(evt);

                if(evt.indexOf("Track") != -1){
                    evt = evt.replace(/(Track)\s*(.+)/g, '$2');
                    evt = evt.replace(/h/g, 'H');
                    evt = evt.replace(/(\d+)(H|$)/g, '$1m$2');
                    formulaConstants[indoor_outdoor][men_women].push(
                                            {name: evt,
                                             a:parseFloat(event[2]),
                                             b:parseFloat(event[3]),
                                             c:parseFloat(event[4]),
                                             type:"time"});
                }else if(evt.indexOf("Road") != -1){
                    evt = evt.replace(/(Road)\s*(.+)/g, '$2 ($1)');
                    formulaConstants[indoor_outdoor][men_women].push(
                                            {name: evt,
                                             a:parseFloat(event[2]),
                                             b:parseFloat(event[3]),
                                             c:parseFloat(event[4]),
                                             type:"time"});
                }else if(evt.indexOf("Walk") != -1){
                    evt = evt.replace(/(Walk)\s*(.+)/g, '$2 ($1)');
                    formulaConstants[indoor_outdoor][men_women].push(
                                            {name: evt,
                                             a:parseFloat(event[2]),
                                             b:parseFloat(event[3]),
                                             c:parseFloat(event[4]),
                                             type:"time"});
                }else if(evt.indexOf("athlon") != -1){
                    formulaConstants[indoor_outdoor][men_women].push(
                                            {name: evt,
                                             a:parseFloat(event[2]),
                                             b:parseFloat(event[3]),
                                             c:parseFloat(event[4]),
                                             type:"points"});
                }else {
                    formulaConstants[indoor_outdoor][men_women].push(
                                            {name: evt,
                                             a:parseFloat(event[2]),
                                             b:parseFloat(event[3]),
                                             c:parseFloat(event[4]),
                                             type:"metres"});
                }

        });

    //console.log("My fromula Obj: ", formulaConstants);
}




function download_constants(callback){
    var all_consts = 0;
    Papa.parse('resources/Constants Indoor 2017 - FEMALE.csv', {
        download: true,
        complete: function(results, file){
            parse_formulas(results, file, "Indoor", "Women");
            all_consts += 1;
            if(all_consts>=4) callback();
        }
    });
    Papa.parse('resources/Constants Outdoor 2017 - FEMALE.csv', {
        download: true,
        complete: function(results, file){
            parse_formulas(results, file, "Outdoor", "Women");
            all_consts += 1;
            if(all_consts>=4) callback();
        }
    });
    Papa.parse('resources/Constants Indoor 2017 - MALE.csv', {
        download: true,
        complete: function(results, file){
            parse_formulas(results, file, "Indoor", "Men");
            all_consts += 1;
            if(all_consts>=4) callback();
        }
    });
    Papa.parse('resources/Constants Outdoor 2017 - MALE.csv', {
        download: true,
        complete: function(results, file){
            parse_formulas(results, file, "Outdoor", "Men");
            all_consts += 1;
            if(all_consts>=4) callback();
        }
    });

}
