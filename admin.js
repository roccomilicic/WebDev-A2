document.getElementById('booking-search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var bsearch = document.getElementById('bsearch').value.trim();
    var errorMessage = document.getElementById('error-message');

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
            if (data.success) {
                console.log('SUCCESS! Data:', data);

                var booking = data.booking;
                var detailsHTML = "<p>Booking ID:        " + booking.bookingID + "</p>" +
                    "<p>Customer Name:     " + booking.cname + "</p>" +
                    "<p>Street Name:       " + booking.stname + "</p>" +
                    "<p>Street Number:     " + booking.snumber + "</p>" +
                    "<p>Date:              " + booking.date + "</p>" +
                    "<p>Time:              " + booking.time + "</p>" +
                    "<p>Status:            " + booking.status + "</p>";

                document.getElementById('reference-number').innerHTML = detailsHTML;
                document.getElementById('booking-details').style.display = 'block'; // Change to 'booking-details'
            }
            else {
                console.log('Error:', data.error);
                document.getElementById('error-message').textContent = data.error;
            }
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
        });
}
