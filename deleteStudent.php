<?php
include 'dbConnection.php';
$studentName = $_POST['DeleteStudentName'];
echo $studentName;

$sql = "DELETE FROM studentKey WHERE student_name = '$studentName'";

    if ($conn->query($sql) === TRUE) {
        echo "Student deleted successfully";
    } else {
        echo "Error deleting student: " . $conn->error;
    }
$conn->close();
?>





