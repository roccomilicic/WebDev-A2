<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "webdev.aut.ac.nz"; // Change this to your database server name
$username = "khf9116"; // Change this to your database username
$password = "nrnlbxrmrquzonykwbjeqcyfoasrzugw"; // Change this to your database password
$dbname = "khf9116"; // Change this to your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    // Validate and sanitize form data
    $cname = $_POST['cname'];
    $phone = $_POST['phone'];
    $snumber = $_POST['snumber'];
    $stname = $_POST['stname'];
    $date = $_POST['date'];
    $time = $_POST['time'];

    // Perform additional validation if needed

    // Insert data into database
    $stmt = $conn->prepare("INSERT INTO bookings (cname, phone, snumber, stname, date, time) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $cname, $phone, $snumber, $stname, $date, $time);

    if ($stmt->execute()) {
        // Return success response
        echo json_encode(['success' => true]);
    } else {
        // Return error response
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}
?>
