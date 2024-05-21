/*
* Student ID: 21151140
* Student Name: Rocco Milicic
* Student Username: khf9116
*
* This file contains the JavaScript code for the admin page.
*/

document.getElementById('booking-search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var bsearch = document.getElementById('bsearch').value.trim();
    var errorMessage = document.getElementById('error-message');

    // Validate input format if not empty
    if (bsearch !== '') {
        var referenceRegex = /^BRN\d{5}$/;
        if (!referenceRegex.test(bsearch)) { // Check if reference number is in the correct format
            errorMessage.textContent = 'Error: Invalid reference number format.';
            return;
        }
    }

    errorMessage.textContent = ''; // Clear error message
    fetchBookingDetails(bsearch); // Fetch booking details
});

function fetchBookingDetails(reference) {
    /* Fetch API POST request to fetch booking details */

    var formData = new FormData(); // Create a new FormData object
    formData.append('reference', reference);

    fetch('admin.php', { // Fetch data from admin.php
        method: 'POST', // Use POST method
        body: formData
    })
        .then(response => { // Handle response from server
            console.log('Response:', response);
            return response.json();
        })
        .then(data => { // Handle data returned from server
            console.log('Data from server:', data);

            if (data.success) { // If data is successfully returned
                console.log('SUCCESS! Data:', data);
                if (Array.isArray(data.bookings)) { // Check if data is an array of bookings
                    data.bookings.forEach(booking => {
                        appendBookingRow(booking); // If so, append booking row to the table
                    });
                } else { // If data is not an array
                    appendBookingRow(data.booking);
                }
            } else { // If data is not successfully returned
                console.log('Error:', data.error);
                document.getElementById('error-message').textContent = data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function appendBookingRow(booking) {
    /* Append booking details to the table */

    // Create a new table row with booking details
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

    // Append the table row to the table body
    document.getElementById('booking-table-body').insertAdjacentHTML('beforeend', tableRow);
    document.getElementById('booking-details').style.display = 'block';
}

function assignBooking(bookingID) {
    /* Assign booking to a driver */

    // Create a new FormData object
    var formData = new FormData();
    formData.append('reference', bookingID);
    formData.append('action', 'assign');

    fetch('admin.php', { // Fetch data from admin.php
        method: 'POST', // Use POST method
        body: formData
    })
        .then(response => response.json()) // Handle response from server
        .then(data => { // Handle data returned from server
            if (data.success) {
                // Display confirmation message and assignment updates
                document.getElementById('confirmation-message').textContent = data.message;
                document.getElementById('status').textContent = 'assigned';
                document.getElementById('assign-button-' + bookingID).disabled = true;
            } else {
                console.error('Error:', data.error);
                document.getElementById('error-message').textContent = data.error;
            }
        })
        .catch(error => { // Handle errors
            console.error('Error:', error);
        });
}

