<?php
$servername = "webdev.aut.ac.nz";
$username = "khf9116";
$password = "nrnlbxrmrquzonykwbjeqcyfoasrzugw";
$dbname = "khf9116";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    $response = array("success" => false, "error" => "Connection failed: " . $conn->connect_error);
    echo json_encode($response);
    exit();
}

// Connection successful, send JSON response indicating success
$response = array("success" => true);
echo json_encode('a' . $response);



/*
// Retrieve and validate input reference number
$reference = isset($_POST['reference']) ? $_POST['reference'] : '';

// Perform server-side validation for the reference number format
if (!preg_match('/^BRN\d{5}$/', $reference)) {
    $response = array("success" => false, "error" => "Invalid reference number format.");
    echo json_encode($response);
    exit(); // Terminate script execution
}

// Query the database to find matching records
$sql = "SELECT * FROM bookings WHERE bookingID = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    $response = array("success" => false, "error" => "Error preparing statement: " . $conn->error);
    echo json_encode($response);
    exit(); // Terminate script execution
}

$stmt->bind_param("s", $reference);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Record found, return the booking details
    $row = $result->fetch_assoc();
    $response = array("success" => true, "booking" => $row);
    echo json_encode($response);
} else {
    // No record found
    $response = array("success" => false, "error" => "No record found.");
    echo json_encode($response);
}

// Close statement and connection
$stmt->close();
$conn->close();*/

?>

