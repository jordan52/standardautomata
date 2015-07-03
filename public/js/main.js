$(function () {

    $('[data-toggle="popover"]').popover();
    $('#login-submit').click(
        function(){
            $('#login-modal-form-group-username').addClass('has-error');
            $('#login-modal-username-help-block').html('username is awful');
            $('#login-modal-form-group-password').addClass('has-error');
            $('#login-modal-password-help-block').html('password is awful');
            $('#login-modal-footer-span').html('lol');
        });

});