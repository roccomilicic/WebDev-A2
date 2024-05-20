<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Retrieve and validate input reference number
$reference = isset($_POST['reference']) ? $_POST['reference'] : '';

// If reference is empty, query bookings with pickup time within 2 hours from now
if (empty($reference)) {
    date_default_timezone_set('Pacific/Auckland');
    $currentDateTime = date('H:i:s');
    $twoHoursLater = date('H:i:s', strtotime('+2 hours'));

    $sql = "SELECT * FROM bookings WHERE `date` = CURDATE() AND `time` BETWEEN '$currentDateTime' AND '$twoHoursLater'";
    $result = $conn->query($sql);

    if ($result === false) {
        $response = array("success" => false, "error" => "Error executing query: " . $conn->error);
        echo json_encode($response);
        exit();
    }

    // If there are bookings within the time range
    if ($result->num_rows > 0) {
        $bookings = array();
        while ($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }

        $response = array("success" => true, "bookings" => $bookings);
        echo json_encode($response);
    } else {
        // If no bookings found within the time range
        $response = array("success" => false, "current time" => $currentDateTime, "plus two 2hrs" => $twoHoursLater, "error" => "No bookings with pickup time within 2 hours from now.");
        echo json_encode($response);
    }
} else {
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

    if ($result === false) {
        $response = array("success" => false, "error" => "Error executing query: " . $stmt->error);
        echo json_encode($response);
        exit();
    }

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

    $stmt->close();
}

$conn->close();
?>