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
                var tableRow = "<tr>" +
                    "<td>" + booking.bookingID + "</td>" +
                    "<td>" + booking.cname + "</td>" +
                    "<td>" + booking.phone + "</td>" +
                    "<td>" + booking.stname + "</td>" +
                    "<td>" + booking.destination + "</td>" +
                    "<td>" + booking.date + " " + booking.time + "</td>" +
                    "<td>" + booking.status + "</td>" +
                    "<td><button onclick='assignBooking(\"" + booking.bookingID + "\")'>Assign</button></td>" +
                    "</tr>";

                // Append the row to the table body
                document.getElementById('booking-table-body').insertAdjacentHTML('beforeend', tableRow);

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

function assignBooking(bookingID) {
    // Add your code to assign the booking here
    console.log("Assigning booking:", bookingID);
}
