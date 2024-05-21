<?php
// Database connection
$servername = "webdev.aut.ac.nz";
$username = "khf9116";
$password = "nrnlbxrmrquzonykwbjeqcyfoasrzugw";
$dbname = "khf9116";

// Create a new connection and validate it
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    $response = array("success" => false, "error" => "Connection failed: " . $conn->connect_error);
    echo json_encode($response);
    exit(); // Terminate script execution
}

// Retrieve customer inputs and insert into database
retrieveInputs();
validateInputs($cname, $phone, $snumber, $stname, $date, $time);
checkAndCreateTable($conn);
$result = generateBRN($conn);
insertBooking($conn, $result, $cname, $phone, $snumber, $stname, $date, $time);

function retrieveInputs()
{
    /* Retrieve customer inputs */
    global $cname, $phone, $snumber, $stname, $date, $time; // Set variables as global
    $cname = isset($_POST['cname']) ? $_POST['cname'] : '';
    $phone = isset($_POST['phone']) ? $_POST['phone'] : '';
    $snumber = isset($_POST['snumber']) ? $_POST['snumber'] : '';
    $stname = isset($_POST['stname']) ? $_POST['stname'] : '';
    $date = isset($_POST['date']) ? $_POST['date'] : '';
    $time = isset($_POST['time']) ? $_POST['time'] : '';
}
function validateInputs()
{
    /* Validate customer inputs */
    global $cname, $phone, $snumber, $stname, $date, $time; // Declare variables as global

    // Check if any required fields are empty 
    if (empty($cname) || empty($phone) || empty($snumber) || empty($stname) || empty($date) || empty($time)) {
        $response = array("success" => false, "error" => "Alllll fields are required.");
        echo json_encode($response);
        exit();
    }

    // Check if the phone field format is correct
    if (!preg_match('/^\d{10,12}$/', $phone)) {
        $response = array("success" => false, "error" => "Phone number must be all numbers with length between 10-12.");
        echo json_encode($response);
        exit();
    }
}

function generateBRN($conn)
{
    $sql = "SELECT MAX(CAST(SUBSTRING(bookingID, 4) AS UNSIGNED)) AS max_id FROM bookings";
    $result = $conn->query($sql);

    if ($result === false) {
        $response = array("success" => false, "error" => "Error: " . $conn->error);
        echo json_encode($response);
        exit(); // Terminate script execution
    } else {
        return $result;
    }
}

function checkAndCreateTable($conn) {
    /* Check if 'bookings' table exists */
    $sql = "SHOW TABLES LIKE 'bookings'";
    $result = $conn->query($sql);

    if ($result->num_rows == 0) {
        // 'bookings' table doesn't exist, create it
        $sql = file_get_contents('mysqlcommand.txt');
        if ($conn->multi_query($sql) === FALSE) {
            $response = array("success" => false, "error" => "Error creating table: " . $conn->error);
            echo json_encode($response);
            exit();
        }
    }
}

function insertBooking($conn, $result, $cname, $phone, $snumber, $stname, $date, $time)
{
    // Generate booking ID
    $row = $result->fetch_assoc();
    $maxId = $row['max_id'];
    $bookingID = "BRN" . sprintf('%05d', $maxId + 1);
    // Set status to unassigned
    $status = "unassigned";

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO bookings (bookingID, cname, phone, snumber, stname, date, time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    if ($stmt === false) { // Validate SQL statement
        $response = array("success" => false, "error" => "Error preparing statement: " . $conn->error);
        echo json_encode($response);
        exit();
    }

    $stmt->bind_param("ssisssss", $bookingID, $cname, $phone, $snumber, $stname, $date, $time, $status);

    // Execute SQL statement
    if ($stmt->execute()) {
        $response = array("success" => true, "bookingID" => $bookingID, "date" => $date, "time" => $time);
        echo json_encode($response);
    } else {
        $response = array("success" => false, "error" => "Error executing statement: " . $stmt->error);
        echo json_encode($response);
    }

    $stmt->close();
}


$conn->close();
?>