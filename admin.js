document.getElementById('booking-search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var bsearch = document.getElementById('bsearch').value.trim();
    var errorMessage = document.getElementById('error-message');
    var referenceDiv = document.getElementById('reference');

    // Validate input format if not empty
    if (bsearch !== '') {
        // Regular expression for reference number format validation
        var referenceRegex = /^[a-zA-Z0-9]{6}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{9}$/;
        if (!referenceRegex.test(bsearch)) {
            errorMessage.textContent = 'Error: Invalid reference number format.';
            return;
        }
    }

    // Clear error message
    errorMessage.textContent = '';

    // Fetch booking details based on search input
    fetchBookingDetails(bsearch);
});

function fetchBookingDetails(reference) {
    // Perform fetch request to the server and handle response
    // Example code:
    // fetch('server-url', {
    //     method: 'POST',
    //     body: JSON.stringify({ reference: reference }),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     // Display booking details
    //     document.getElementById('reference-number').textContent = data.reference;
    //     document.getElementById('reference').style.display = 'block';
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
}
