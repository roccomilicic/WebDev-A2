document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var cname = document.getElementById("cname").value;
    var phone = document.getElementById("phone").value;
    var snumber = document.getElementById("snumber").value;
    var stname = document.getElementById("stname").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;


    // If all validations pass, submit the form
    submitForm();
});

function submitForm() {

    alert("Form submitted successfully!");
}
