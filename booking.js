document.getElementById("bookingForm").addEventListener("submit", function(event) {
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

