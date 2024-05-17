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

// Retrieve and validate customer inputs
$cname = isset($_POST['cname']) ? $_POST['cname'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';
$snumber = isset($_POST['snumber']) ? $_POST['snumber'] : '';
$stname = isset($_POST['stname']) ? $_POST['stname'] : '';
$date = isset($_POST['date']) ? $_POST['date'] : '';
$time = isset($_POST['time']) ? $_POST['time'] : '';

// Perform client-side validation
if (empty($cname) || empty($phone) || empty($snumber) || empty($stname) || empty($date) || empty($time)) {
    $response = array("success" => false, "error" => "All fields are required.");
    echo json_encode($response);
    exit(); // Terminate script execution
}

if (!preg_match('/^\d{10,12}$/', $phone)) {
    $response = array("success" => false, "error" => "Phone number must be all numbers with length between 10-12.");
    echo json_encode($response);
    exit(); // Terminate script execution
}

// Generate a unique booking reference number
$sql = "SELECT MAX(CAST(SUBSTRING(bookingID, 4) AS UNSIGNED)) AS max_id FROM bookings";
$result = $conn->query($sql);

if ($result === false) {
    $response = array("success" => false, "error" => "Error: " . $conn->error);
    echo json_encode($response);
    exit(); // Terminate script execution
}

$row = $result->fetch_assoc();
$maxId = $row['max_id'];
$bookingID = "BRN" . sprintf('%05d', $maxId + 1);
$status = "unassigned";

// Insert data into MySQL table
$stmt = $conn->prepare("INSERT INTO bookings (bookingID, cname, phone, snumber, stname, date, time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

if ($stmt === false) {
    $response = array("success" => false, "error" => "Error preparing statement: " . $conn->error);
    echo json_encode($response);
    exit(); // Terminate script execution
}

$stmt->bind_param("ssisssss", $bookingID, $cname, $phone, $snumber, $stname, $date, $time, $status);

if ($stmt->execute()) {
    $response = array("success" => true, "bookingID" => $bookingID, "date" => $date, "time" => $time);
    echo json_encode($response);
} else {
    $response = array("success" => false, "error" => "Error executing statement: " . $stmt->error);
    echo json_encode($response);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
