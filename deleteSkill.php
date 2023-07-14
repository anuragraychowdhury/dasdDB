<?php
include 'dbConnection.php'; // Assuming you have a database connection file

$skillId = $_POST['skillId'];

$sql = "DELETE FROM skillKey WHERE skilltag = '$skillId'";

if ($conn->query($sql) === TRUE) {
    echo "Skill deleted successfully";
} else {
    echo "Error deleting skill: " . $conn->error;
}

$conn->close();
?>
