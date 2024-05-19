document.getElementById('booking-search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var bsearch = document.getElementById('bsearch').value.trim();
    var errorMessage = document.getElementById('error-message');
    var referenceDiv = document.getElementById('reference');

    // Validate input format if not empty
    if (bsearch !== '') {
        var referenceRegex = /^BRN\d{5}$/;
        if (!referenceRegex.test(bsearch)) {
            errorMessage.textContent = 'Error: Invalid reference number format.';
            return;
        }
    }

    errorMessage.textContent = '';
    fetchBookingDetails(bsearch);
});

function fetchBookingDetails(reference) {

    console.log("Fetching booking details...");
    console.log("Reference: " + reference);


    // Create a FormData object to send the reference number to the server
    var formData = new FormData();
    formData.append('reference', reference);

    // Fetch request to the server
    fetch('admin.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            console.log('Response:', response);
            return response.json();
        })
        .then(data => {
            // Check if the request was successful
            if (data.success) {
                // Display booking details
                console.log('Data:', data);
                var booking = data.booking;
                document.getElementById('reference-number').textContent = booking.bookingID;
                // Display other booking details as needed
                document.getElementById('reference').style.display = 'block';
            } else {
                // Display error message
                console.log('Error:', data.error);
                document.getElementById('error-message').textContent = data.error;
            }
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
        });
}

