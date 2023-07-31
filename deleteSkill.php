<?php
include 'dbConnection.php'; // Assuming you have a database connection file

$skillName = $_POST['SkillName']; // Change the parameter name to SkillName

// Sanitize the input to prevent SQL injection
$skillName = mysqli_real_escape_string($conn, $skillName);

$sql = "DELETE FROM skillKey WHERE skill = '$skillName'";

if ($conn->query($sql) === TRUE) {
    echo "Skill deleted successfully";
} else {
    echo "Error deleting skill: " . $conn->error;
}

$conn->close();
?>
