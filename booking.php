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
    die("Connection failed: " . $conn->connect_error);
}

// Generate a unique booking reference number
$sql = "SELECT MAX(id) AS max_id FROM bookings";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$maxId = $row['max_id'];
$booking_id = "BRN" . sprintf('%05d', $maxId + 1);

// Retrieve customer inputs
$cname = $_POST['cname'];
$phone = $_POST['phone'];
$snumber = $_POST['snumber'];
$stname = $_POST['stname'];
$date = $_POST['date'];
$time = $_POST['time'];

// Insert data into MySQL table
$stmt = $conn->prepare("INSERT INTO bookings (booking_id, customer_name, phone, street_number, street_name, date, time, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'unassigned')");
$stmt->bind_param("ssissss", $bookingID, $cname, $phone, $snumber, $stname, $date, $time);

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
