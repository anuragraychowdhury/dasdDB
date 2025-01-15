<?php
include 'dbConnection.php'; 

# retrieve the skill name from the web form
$skillName = $_POST['SkillName']; 

# sanitize user inputs to prevent SQL injection attacks
# refer to delete category for logic moving forward
$skillName = mysqli_real_escape_string($conn, $skillName);

$sql = "DELETE FROM skillKey WHERE skill = '$skillName'";

if ($conn->query($sql) === TRUE) {
    echo "Skill deleted successfully";
} else {
    echo "Error deleting skill: " . $conn->error;
}

$conn->close();
?>
