<?php
include 'dbConnection.php'; 

# displaying of errors here
ini_set('display_errors', 1);
error_reporting(E_ALL);

# send data to dorm for student id and date that is being graded
$sid = $_POST["grading_sid"];
$date = $_POST["grading_date"];
$grade = 1; # set grade to 1
$skilltag = 0; # set skilltag to 0

// Check if the student is already marked as absent for the given date
$sql_check = "SELECT * FROM `gradingTable` WHERE `student_id`='$sid' AND `date`='$date' AND `skilltag`='$skilltag'";
$result_check = $conn->query($sql_check);

# the purpose of this statement is to TOGGLE the button. if it is already marked absent, it removes it (the button was pressed)
if ($result_check->num_rows > 0) {
    # the student is already marked as absent, so remove the absent entry
    $sql_remove_absent = "DELETE FROM `gradingTable` WHERE `student_id`='$sid' AND `date`='$date' AND `skilltag`='$skilltag'";
    $result_remove_absent = $conn->query($sql_remove_absent);

    if ($result_remove_absent) {
        echo "Absent entry removed for student $sid on $date.";
    } else {
        echo "Error removing absent entry: " . $conn->error;
    }
} else {
    # the student is not marked as absent, so insert the absent entry
    $sql_insert_absent = "INSERT INTO `gradingTable` (`student_id`, `date`, `skilltag`, `grade`) VALUES ('$sid', '$date', '$skilltag', '$grade')";
    $result_insert_absent = $conn->query($sql_insert_absent);

    if ($result_insert_absent) {
        echo "Student marked as absent with grade $grade for $date.";
    } else {
        echo "Error marking student as absent: " . $conn->error;
    }
}
?>
