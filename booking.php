<?php
// Database connection
$servername = "webdev.aut.ac.nz";
$username = "khf9116";
$password = "nrnlbxrmrquzonykwbjeqcyfoasrzugw";
$dbname = "khf9116";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    $response = array("success" => false, "error" => "Connection failed: " . $conn->connect_error);
    echo json_encode($response);
    exit(); // Terminate script execution
}

// Generate a unique booking reference number
$sql = "SELECT MAX(id) AS max_id FROM bookings";
$result = $conn->query($sql);

if ($result === false) {
    $response = array("success" => false, "error" => "Error: " . $conn->error);
    echo json_encode($response);
    exit(); // Terminate script execution
}

$row = $result->fetch_assoc();
$maxId = $row['max_id'];
$booking_id = "BRN" . sprintf('%05d', $maxId + 1);

// Retrieve customer inputs
$cname = isset($_GET['cname']) ? $_GET['cname'] : '';
$phone = isset($_GET['phone']) ? $_GET['phone'] : '';
$snumber = isset($_GET['snumber']) ? $_GET['snumber'] : '';
$stname = isset($_GET['stname']) ? $_GET['stname'] : '';
$date = isset($_GET['date']) ? $_GET['date'] : '';
$time = isset($_GET['time']) ? $_GET['time'] : '';

// Insert data into MySQL table
$stmt = $conn->prepare("INSERT INTO bookings (booking_id, customer_name, phone, street_number, street_name, date, time, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'unassigned')");

if ($stmt === false) {
    $response = array("success" => false, "error" => "Error: " . $conn->error);
    echo json_encode($response);
    exit(); // Terminate script execution
}

$stmt->bind_param("ssissss", $booking_id, $cname, $phone, $snumber, $stname, $date, $time);

if ($stmt->execute()) {
    $response = array("success" => true);
    echo json_encode($response);
} else {
    $response = array("success" => false, "error" => "Failed to submit the booking. Please try again later.");
    echo json_encode($response);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
