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

    var formData = new FormData();
    formData.append('reference', reference);

    fetch('admin.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            console.log('Response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data from server:', data);

            if (data.success) {
                console.log('SUCCESS! Data:', data);
                if (Array.isArray(data.bookings)) {
                    // Handle array of bookings
                    data.bookings.forEach(booking => {
                        appendBookingRow(booking);
                    });
                } else {
                    // Handle single booking
                    appendBookingRow(data.booking);
                }
            } else {
                console.log('Error:', data.error);
                document.getElementById('error-message').textContent = data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function appendBookingRow(booking) {
    var tableRow = "<tr>" +
        "<td>" + booking.bookingID + "</td>" +
        "<td>" + booking.cname + "</td>" +
        "<td>" + booking.phone + "</td>" +
        "<td>" + booking.stname + "</td>" +
        "<td>" + booking.destination + "</td>" +
        "<td>" + booking.date + " " + booking.time + "</td>" +
        "<td id='status'>" + booking.status + "</td>" +
        "<td><button id='assign-button' onclick='assignBooking(\"" + booking.bookingID + "\")'>Assign</button></td>" +
        "</tr>";
    document.getElementById('booking-table-body').insertAdjacentHTML('beforeend', tableRow);
    document.getElementById('booking-details').style.display = 'block';
}

function assignBooking(bookingID) {
    console.log("Assigning booking:", bookingID);

    var formData = new FormData();
    formData.append('reference', bookingID);
    formData.append('action', 'assign');

    fetch('admin.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('[ASSIGNING] Data from server:', data);
            if (data.success) {
                console.log('[ASSIGNING] SUCCESS! Message:', data.message);
                document.getElementById('confirmation-message').textContent = data.message;
                // Update the status in the table row
                document.getElementById('status').textContent = 'assigned';
                // Optionally disable the 'Assign' button
                document.getElementById('assign-button-' + bookingID).disabled = true;
            } else {
                console.error('Error:', data.error);
                document.getElementById('error-message').textContent = data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

