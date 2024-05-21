document.getElementById("bookingForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values (purposefully left out unit number and suburbs as they were optional values)
    var cname = document.getElementById("cname").value;
    var phone = document.getElementById("phone").value;
    var snumber = document.getElementById("snumber").value;
    var stname = document.getElementById("stname").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;

    // Validate form values
    var errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = "";

    // Check if all required fields are filled
    if (!cname.trim() || !phone.trim() || !snumber.trim() || !stname.trim() || !date.trim() || !time.trim()) {
        errorMessage.textContent = "All required fields must be filled.";
        return;
    }

    // Validate phone number format
    var phoneRegex = /^[0-9]{10,12}$/;
    if (!phone.match(phoneRegex)) {
        errorMessage.textContent = "Phone number must be all numbers with length between 10-12";
        return;
    }

    //  Validate date format
    var currentDate = new Date();
    var selectedDate = new Date(date + 'T' + time);
    if (selectedDate < currentDate) {
        errorMessage.textContent = "Pick-up date and time must not be earlier than current date and time.";
        return;
    }

    console.log("Form is valid.");
});

function submitForm() {
    /* Fetch API POST request to submit booking form */
    console.log("Submitting form...");
    var formData = new FormData(document.getElementById("bookingForm"));

    fetch('booking.php', {
        method: 'POST',
        body: formData
    })
        .then(response => { // Handle response from server
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => { // Handle data returned from server
            console.log(data);
            if (data.success) { // If booking is successful
                console.log("Form submitted");
                confirmBooking(data); // Display confirmation message to the user
            } else { // If booking is unsuccessful
                alert('Error: ' + data.error); // Display error message to the user
            }
        })
        .catch(error => { // Handle errors
            console.error('Error:', error);
            alert('An error occurred while submitting the form. Please try again later.');
        });
}

function confirmBooking(data) {
    /* Display confirmation message to the user */
    var confirmationMessage = document.createElement("div");
    confirmationMessage.innerHTML = `
    <p><b>Thank you for your booking!</b></p>
    <p>Booking reference number: ${data.bookingID}</p>
    <p>Pickup time: ${data.time}</p>
    <p>Pickup date: ${dateDDMMYY(data.date)}</p>
`;
    // Append confirmation message to the page
    document.getElementById("reference").appendChild(confirmationMessage);
    document.getElementById("bookingForm").reset();
}

function dateDDMMYY(dateString) {
    /* Format date in dd/mm/yyyy format */
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatDate(date) {
    /* Format date in dd/mm/yyyy format */
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();
    return day + '/' + month + '/' + year;
}

function formatTime(date) {
    /* Format time in hh:mm format */
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    return hours + ':' + minutes;
}

// Set initial values for Pick-Up Date and Time fields
document.addEventListener("DOMContentLoaded", function () {
    var currentDate = new Date();
    var currentDateFormatted = formatDate(currentDate);
    var currentTimeFormatted = formatTime(currentDate);

    // Set the value of the date and time input fields
    document.getElementById("date").value = currentDateFormatted;
    document.getElementById("time").value = currentTimeFormatted;
});
