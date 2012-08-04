$(function() {
    //hide the show_message label by default
    $('.coupon_gen').hide();

    $('#logoutBtn').click(function(e){
        window.location.href = this.href;
    });

    $('#coupon_form').submit(function(){
        $.ajax({
            url: $SCRIPT_ROOT+'/coupon/new',
            type: "POST",
            data: $(this).serialize(),
            success: function(data) {
                $('#coupon_value').text(data.coupon);
                $('#show_message').text(data.msg);
                $('.coupon_gen').show();
            }
        });
        return false;
    });

    $('#delete_coupon').submit(function(){
        $.ajax({
            url: $SCRIPT_ROOT+'/coupon/delete',
            type: "POST",
            data: $(this).serialize(),
            success: function(data) {
                $('#delete_message').text(data.msg);
                $('.delete_gen').show();
            }
        });
        return false;
    });

    $('#user_name').focusout(function(){
        var username = $("#user_name").val().toLowerCase();
        var details_url = $SCRIPT_ROOT + '/candidate/' + username;
        var details_template = "\
            <img src={{image_url}} style='margin: 0px auto;'> \
            <div class='caption'> \
                <dl class='dl-horizontal'> \
                    <dt>Name</dt> <dd>{{ name }}</dd> \
                    <dt>Hostel</dt> <dd>{{ hostel }}</dd> <dt>Department</dt> \
                    <dd>{{ dept }}</dd> \
                </dl> \
            </div> \
        "; 
        if (username != "abstain"){
            //Fetch candidate details only if username 
            //is not "abstain"
            $.get(details_url, function(data){
                generated_html = Mustache.to_html(details_template, data);
                $('.user_details').show();
                $('.user_details').html(generated_html);
            });
        }
    });


    $('#add_candidate_form').submit(function(){
        $.ajax({
            url: $SCRIPT_ROOT+'/candidate/new',
            type: "POST",
            data: $(this).serialize(),
            success: function(data){
                $('.add_status').text(data.status_msg);
                $('#reset_btn').click();
            }
        });
        $('.user_details').hide();
        return false;
    });

    $('.post_toggle_link').click(function(){
        var max_votes_for_post = $('.post_heading').data('maxCount');
        var current_count = $('.candidate_selected').length;
        if (current_count > max_votes_for_post) {
            alert("Please select the valid number of candidates before proceeding");
            return false;
        } else {
            $(this).parent().siblings().removeClass('active');
            $(this).parent().toggleClass('active');
        }
    });

    $('#main').delegate(".candidate-tile", "click", function(e){
        $(this).toggleClass("candidate_selected");
        $(this).find('.checkbox').toggleClass('checkbox_selected');
        var max_votes_for_post = $('.post_heading').data('maxCount');
        var current_count = $('.candidate_selected').length;
        if (current_count > max_votes_for_post) {
            $('#error_notif').html("<strong>Error</strong> Please select at max " + max_votes_for_post + " candidate(s) for this post");
            $('#error_notif').slideDown();
        } else {
            $('#error_notif').slideUp();
        }
    });
});
