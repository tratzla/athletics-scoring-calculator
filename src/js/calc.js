

$(document).ready(function() {
    $('.ui.tabular.menu .item').tab();
    $('.dropdown').dropdown();


    $('.event_lookup .checkbox').checkbox()
        .checkbox({
            onChange: function() {

                var this_radio_group = $(this).attr('name');
                var lookup_type = "normal";
                if($(this).hasClass("reverse")) lookup_type = "reverse";

                if (lookup_type == "normal"){
                    var cb_other = $('.'+this_radio_group
                                     +'.reverse'
                                     +' .checkbox');
                }else{
                    var cb_other = $('.'+this_radio_group
                                     +'.normal'
                                     +' .checkbox');
                }

                var check_pattern = $('.'+this_radio_group
                                     +'.'+lookup_type
                                     +' .checkbox')
                    .checkbox('is checked');

                console.log(this_radio_group);
                console.log(lookup_type);
                console.log(check_pattern);

                if (check_pattern[0]){
                        cb_other.first()
                            .checkbox('set checked');
                    }else{
                        cb_other.last()
                            .checkbox('set checked');
                    }

           }
        });
});
