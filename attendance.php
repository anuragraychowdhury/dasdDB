<?php
include 'dbConnection.php';

$startDate = $_GET['start_date'];
$endDate = $_GET['end_date'];
$studentID = $_GET['student_id'];

// Use prepared statement to prevent SQL injection
$stmt = $conn->prepare("SELECT student_id, COUNT(DISTINCT date) AS total_unique_dates, SUM(CASE WHEN skilltag = 0 THEN 1 ELSE 0 END) AS total_dates_with_skilltag_0 FROM gradingTable WHERE student_id = ? AND date >= ? AND date <= ? GROUP BY student_id");

// Bind the parameters
$stmt->bind_param("iss", $studentID, $startDate, $endDate);

// Execute the query
$stmt->execute();

// Get the result
$result = $stmt->get_result();

// Fetch the data into an associative array
$data = $result->fetch_all(MYSQLI_ASSOC);

// Close the statement and connection
$stmt->close();
$conn->close();

// Output the result as JSON
echo json_encode($data);
?>
