<?php
include 'dbConnection.php'; // Assuming you have a database connection file

ini_set('display_errors', 1);
error_reporting(E_ALL);

$sid = $_POST["grading_sid"];
$date = $_POST["grading_date"];
$grade = 1; // Set grade to 1
$skilltag = 0; // Set skilltag to 0

// Check if the student is already marked as absent for the given date
$sql_check = "SELECT * FROM `gradingTable` WHERE `student_id`='$sid' AND `date`='$date' AND `skilltag`='$skilltag'";
$result_check = $conn->query($sql_check);

if ($result_check->num_rows > 0) {
    // The student is already marked as absent, so remove the absent entry
    $sql_remove_absent = "DELETE FROM `gradingTable` WHERE `student_id`='$sid' AND `date`='$date' AND `skilltag`='$skilltag'";
    $result_remove_absent = $conn->query($sql_remove_absent);

    if ($result_remove_absent) {
        echo "Absent entry removed for student $sid on $date.";
    } else {
        echo "Error removing absent entry: " . $conn->error;
    }
} else {
    // The student is not marked as absent, so insert the absent entry
    $sql_insert_absent = "INSERT INTO `gradingTable` (`student_id`, `date`, `skilltag`, `grade`) VALUES ('$sid', '$date', '$skilltag', '$grade')";
    $result_insert_absent = $conn->query($sql_insert_absent);

    if ($result_insert_absent) {
        echo "Student marked as absent with grade $grade for $date.";
    } else {
        echo "Error marking student as absent: " . $conn->error;
    }
}
?>
