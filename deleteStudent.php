<?php
/**
 * Delete Student API
 * 
 * This file handles deleting a student from the database. It receives a student ID
 * via POST request and removes the corresponding record from the studentKey table.
 * 
 */

include 'dbConnection.php';

# same overall logic as deleteSkill and deleteCategory
$studentId = $_POST['studentId'];
echo $studentId;

$sql = "DELETE FROM studentKey WHERE student_id = '$studentId'";

if ($conn->query($sql) === TRUE) {
    echo "Student deleted successfully";
} else {
    echo "Error deleting student: " . $conn->error;
}
$conn->close();
?>





