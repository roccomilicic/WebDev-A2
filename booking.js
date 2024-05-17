document.getElementById("bookingForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var cname = document.getElementById("cname").value;
    var phone = document.getElementById("phone").value;
    var snumber = document.getElementById("snumber").value;
    var stname = document.getElementById("stname").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;

    var errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = "";

    if (!cname.trim() || !phone.trim() || !snumber.trim() || !stname.trim() || !date.trim() || !time.trim()) {
        errorMessage.textContent = "All required fields must be filled.";
        return;
    }

    var phoneRegex = /^[0-9]{10,12}$/;
    if (!phone.match(phoneRegex)) {
        errorMessage.textContent = "Phone number must be all numbers with length between 10-12";
        return;
    }

    var currentDate = new Date();
    var selectedDate = new Date(date + 'T' + time);
    if (selectedDate < currentDate) {
        errorMessage.textContent = "Pick-up date and time must not be earlier than current date and time.";
        return;
    }

    console.log("Form is valid.");
    submitForm();
});

function submitForm(dataSource) {
    console.log("Submitting form...");
    console.log("Data source: " + dataSource);
    var formData = new FormData(document.getElementById("bookingForm"));

    console.log("Form data: " + formData);
    console.log("Form data: " + formData.get("cname"));
    console.log("Form data: " + formData.get("phone"));
    console.log("Form data: " + formData.get("snumber"));
    console.log("Form data: " + formData.get("stname"));
    console.log("Form data: " + formData.get("date"));
    console.log("Form data: " + formData.get("time"));

    fetch(dataSource, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle response from server
            console.log(data);
            if (data.success) {
                console.log("Form submitted");
                // Display confirmation message
                confirmBooking(data);
            } else {
                // Display error message to the user
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Display error message to the user
            alert('An error occurred while submitting the form. Please try again later.');
        });
}

function confirmBooking(data) {
    var confirmationMessage = document.createElement("div");
    confirmationMessage.innerHTML = `
    <p><b>Thank you for your booking!</b></p>
    <p>Booking reference number: ${data.bookingID}</p>
    <p>Pickup time: ${data.time}</p>
    <p>Pickup date: ${dateDDMMYY(data.date)}</p>
`;
    document.getElementById("confirmation-message").appendChild(confirmationMessage);
    document.getElementById("bookingForm").reset();
}

function dateDDMMYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Function to format date in dd/mm/yyyy format
function formatDate(date) {
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();
    return day + '/' + month + '/' + year;
}

// Function to format time in HH:MM format
function formatTime(date) {
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    return hours + ':' + minutes;
}

// Set initial values for Pick-Up Date and Time fields
document.addEventListener("DOMContentLoaded", function() {
    var currentDate = new Date();
    var currentDateFormatted = formatDate(currentDate);
    var currentTimeFormatted = formatTime(currentDate);

    document.getElementById("date").value = currentDateFormatted;
    document.getElementById("time").value = currentTimeFormatted;
});


