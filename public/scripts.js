$(document).ready(function() {
    var uniqueId = generateUniqueId();
    $('#uniqueId').val(uniqueId);

    // Function to generate a random unique ID
    function generateUniqueId() {
        return Math.floor(1000 + Math.random() * 9000); // Generates a random number between 1000 and 9999
    }

    // Handle form submission
    $('#addCompetitionForm').submit(function(event) {
        event.preventDefault();
        var topic = $('#topic').val();
        var lastDate = $('#lastDate').val();
        var uniqueId = $('#uniqueId').val(); // Get the unique ID from the hidden input field

        // Send a POST request to the server with contest details
        $.ajax({
            type: 'POST',
            url: '/admin/add-competition',
            data: { topic: topic, lastDate: lastDate, uniqueId: uniqueId }, // Include unique ID in the data
            success: function(response) {
                alert(response.message);
                // Optionally, redirect to another page or perform other actions
            },
            error: function(xhr, status, error) {
                var errorMessage = JSON.parse(xhr.responseText).message;
                alert(errorMessage);
            }
        });
    });

    $('#adminLoginForm').submit(function(event) {
        event.preventDefault();
        var email = $('#email').val();
        var password = $('#password').val();

        // Logging to console for debugging purposes
        console.log('Submitting login form...');

        // Send a POST request to the server with admin credentials
        $.ajax({
            type: 'POST',
            url: '/admin/login',
            data: { email: email, password: password },
            success: function(response) {
                // Redirect to admin dashboard or perform any other action on successful login
                alert(response.message);
                window.location.href = '/admin/dashboard'; // Redirecting to admin dashboard
            },
            error: function(xhr, status, error) {
                // Handling errors
                var errorMessage = JSON.parse(xhr.responseText).message;
                alert(errorMessage);
            }
        });
    });

    $('#userLoginForm').submit(function(event) {
        event.preventDefault();
        var email = $('#email').val();
        var password = $('#password').val();

        // Send a POST request to the server with user login credentials
        $.ajax({
            type: 'POST',
            url: '/login',
            data: { email: email, password: password },
            success: function(response) {
                // Redirect to user dashboard or perform any other action on successful login
                alert(response.message);
                window.location.href = '/user/dashboard'; // Redirecting to user dashboard
            },
            error: function(xhr, status, error) {
                // Handling errors
                var errorMessage = JSON.parse(xhr.responseText).message;
                alert(errorMessage);
            }
        });
    });

    $('#userRegistrationForm').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        var formData = {
            username: $('#username').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            mobileNumber: $('#mobileNumber').val()
        };

        // Send a POST request to the server with the form data
        $.ajax({
            type: 'POST',
            url: '/register',
            data: formData,
            success: function(response) {
                // Display a success message to the user
                alert(response.message);
                // Optionally, redirect to another page or perform other actions
            },
            error: function(xhr, status, error) {
                // Display an error message to the user
                var errorMessage = JSON.parse(xhr.responseText).message;
                alert(errorMessage);
            }
        });
    });

    // Handle voting button click
    $(document.body).on('click', '.voteButton', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const photoId = $(this).data('photo-id'); // Get the photo ID from the button's data attribute

        $.ajax({
            type: 'POST',
            url: `/view-photo/vote`,
            data: { photoId: photoId }, // Send the photo ID to the server
            success: function(response) {
                alert('Vote successful');
                $('.voteButton[data-photo-id="' + photoId + '"]').addClass('voted').text('Voted'); // Add the voted class and change the button text
                $('.voteButton').prop('disabled', true); // Disable all vote buttons after voting
            },
            error: function(xhr, status, error) {
                var errorMessage = JSON.parse(xhr.responseText).message;
                alert(errorMessage);
            }
        });
    });

    // Handle notify button click
    $(document.body).on('click', '.notify-button', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const email = $(this).data('email'); // Get the email from the button's data attribute

        // Send a POST request to the server to trigger email sending
        $.ajax({
            type: 'POST',
            url: '/admin/notify',
            data: { email: email }, // Send the email address to the server
            success: function(response) {
                alert('Notification sent successfully');
            },
            error: function(xhr, status, error) {
                var errorMessage = JSON.parse(xhr.responseText).message;
                alert(errorMessage);
            }
        });
    });

    // Handle choose winner button click
      // Handle choose winner button click
      $(document.body).on('click', '.chooseWinnerButton', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const photoId = $(this).data('photo-id'); // Get the photo ID from the button's data attribute
        const winnerEmail = $(this).data('photo-email'); // Get the winner's email from the button's data attribute
        console.log('Clicked on Choose Winner button');

        // Log the photo ID and winner's email to ensure they are retrieved correctly
        console.log('Photo ID:', photoId);
        console.log('Winner Email:', winnerEmail);

        // Send a POST request to the server to notify the winner
        $.ajax({
            type: 'POST',
            url: '/admin/notify-winner',
            data: { photoId: photoId, email: winnerEmail }, // Send the photo ID and winner's email address to the server
            success: function(response) {
                alert('Winner chosen successfully');
            },
            error: function(xhr, status, error) {
                var errorMessage = JSON.parse(xhr.responseText).message;
                alert(errorMessage);
            }
        });
    });
});
