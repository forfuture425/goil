import { main } from './ex.js';
const mainObj = new main();
let searchParams = new URLSearchParams(location.search);

$(document).ready(async function () {

    function isMobileScreen() {
        return window.innerWidth <= 768;
    }


    function mainer() {

        const counterDiv = document.getElementById('countdown');
        if (counterDiv)
            updateTimeLeft()


        validateForm()

    }

    function validateForm() {

       // const regex = /^(https?:\/\/)?(www\.)?(linkedin\.com|instagram\.com|facebook\.com|twitter\.com)\/.+$/;
        

        
        $('#email').on('input', function () {
            const emailInput = $(this).val();
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (emailInput === '') {
                $(this).addClass('is-invalid');
                $(this).next('.invalid-feedback').text('Email is required');
            } else if (!emailInput.match(regex)) {
                $(this).addClass('is-invalid');
                $(this).next('.invalid-feedback').text('Invalid email address');
            } else {
                $(this).removeClass('is-invalid');
            }
        });
    
            
     

        $('#code').on('input', function () {
            $('#social_link').removeClass('is-invalid'); // link not required for code
            const isValid = /^[a-zA-Z0-9]{5,}$/.test($(this).val());
            if ($(this).val() !== '' && isValid) {
                
                $(this).removeClass('is-invalid');
            } else {
                
                $(this).addClass('is-invalid');
            }
        });

        $('#social_link').on('input', function () {
            
            const isValid = /^[a-zA-Z0-9]{3,}$/.test($(this).val());
            if ($(this).val() !== '' && isValid) {
                 
                $(this).removeClass('is-invalid');
            } else {
                 
                $(this).addClass('is-invalid');
            }
        });

      
    }

    function showSpinner() {
        $('.btn-text').hide();  // Hide the text
        $('.spinner-border').show();  // Show the spinner
        
    }

    function hideSpinner() {
        $('.btn-text').show(); // Show the text
        $('.spinner-border').hide(); // Hide the spinner
    }



    function setCounter(targetDate) {
        const now = new Date();
        const timeLeft = targetDate - now;

        if (timeLeft >= 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            $('.counter-division').text(':')

            $('#days').text(String(days).padStart(2, '0'));
            $('#hours').text(String(hours).padStart(2, '0'));
            $('#minutes').text(String(minutes).padStart(2, '0'));
            $('#seconds').text(String(seconds).padStart(2, '0'));

        } else {
            // hide counter
            $('#countdown').css('display', 'none')
        }
    }

    function updateTimeLeft() {
        const launchDate = "5";
        const launchMonth = "6";
        const launchYear = "2024";

        const targetDate = new Date(launchYear, launchMonth - 1, launchDate, 0, 0);

        setCounter(targetDate)

        setInterval(() => {
            setCounter(targetDate)
        }, 1000);
    }

    mainer()
    //$('#contactSuccessModal').modal('show');
 
    $('#done_btn').click(function () {

        $('#successModal').modal('hide');

        $('#allow_form')[0].reset();
    });

    $('#contact_done_btn').click(function () {

        $('#contactSuccessModal').modal('hide');

        $('#allow_form')[0].reset();
    });




    $('#try_again_btn').submit(async function (event) {
        event.preventDefault();



        $('#errorModal').modal('hide');
        $('#allow_form')[0].reset();
        $('#formModal').modal('show');



    });

    $('#duplicate_btn').submit(async function (event) {
        event.preventDefault();
        $('#duplicateModal').modal('hide');
         



    });

    $('#allow_form').on('input', function() {
       
        let allValid = true;
        $('#allow_form .form-control').each(function() {
            if (!this.checkValidity()) {
                allValid = false;
            }
        });
        const linkValValid = /^[a-zA-Z0-9]{3,}$/.test($('#social_link').val().trim());
        const codeValValid = /^[a-zA-Z0-9]{5,}$/.test($('#code').val().trim());
       // const linkValValid = $('#social_link').val().trim();

        const  isCheckboxChecked = $('#flexCheckChecked').is(':checked');
        const isEmailNotEmpty = $('#email').val().trim() !== '';
        
    
        if (allValid && isCheckboxChecked && isEmailNotEmpty && (linkValValid || codeValValid)) {
            $('.submit-btn').removeAttr('disabled');
        } else {
            $('.submit-btn').attr('disabled', 'disabled');
        }
    });



    $('#allow_form').submit(async function (event) {
        
        event.preventDefault();

    
        if($('#email').val().trim() === ''){
            $('#email').addClass('is-invalid');
            $('#email').next('.invalid-feedback').text('Email is required');
            return;
        }

        if (!$('#flexCheckChecked').is(':checked')) {
            $('#terms_p').addClass('checkboxAlert');
            setTimeout(function() {
                $('#terms_p').removeClass('checkboxAlert');
            }, 3000);
            
            return;
        }
        else{
            $('#terms_p').removeClass('checkboxAlert')
        }

        const emailValue = $('#email').val();
        const socialLink = $('#social_link').val().trim();

        if($('#code').val().trim() === '' && socialLink===''){
            $('#social_link').addClass('is-invalid');
            $('#social_link').next('.invalid-feedback').text('Social link or code are required');
             return;
        }

        
       
        if($('#code').val().trim() !== ''){ // code flow
            showSpinner()
            
            
            const codeValue = $('#code').val();
            const socialObj={};

            if(socialLink!==''){
                const currentValue = $('#socialDropdown').val();
                socialObj.platform = currentValue;
                socialObj.username=socialLink
            }

            
            const resSignUp = await mainObj.evmLpSignUp(emailValue, codeValue,socialObj);
            console.log(resSignUp)

            hideSpinner()

            $('#formModal').modal('hide');
            if (resSignUp.result) {
                $('#successModal').modal('show');
                return true;
            }
            else {
                switch(resSignUp.error){
                    case 'signup':
                        $('#duplicateModal').modal('show');
                    break;
                    default:
                      
                        $('#errorModal').modal('show');
                    break;
                }
                
                return true;

            }

             
           
        } // no code
        else{
            if(socialLink ===''){
                $('#social_link').addClass('is-invalid');
                $('#social_link').next('.invalid-feedback').text('Social Link is required');
                return;
            }
            showSpinner()
            const socialObj={};
            const currentValue = $('#socialDropdown').val();
            socialObj.platform = currentValue;
            socialObj.username=socialLink;
            socialObj.email=emailValue;
            console.log(socialObj)
            const resSignUp = await mainObj.evmLpContactUs(socialObj);
            console.log(resSignUp)

            hideSpinner()
            $('#formModal').modal('hide');
            if (resSignUp.result) {
                $('#contactSuccessModal').modal('show');
                return true;
            }
            else {
                switch(resSignUp.error){
                   
                    default:
                      
                        $('#errorModal').modal('show');
                    break;
                }
                
                return true;

            }

        }


       
        
       

        // const codeObj={
        //     email: emailValue,
        //     code: codeValue
        // }
    });





}); 