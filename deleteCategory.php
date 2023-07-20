<?php
include 'dbConnection.php'; // Assuming you have a database connection file

$categoryToDelete = $_POST['CategoryName']; // Change the parameter name to CategoryName

// Sanitize the input to prevent SQL injection
$categoryToDelete = mysqli_real_escape_string($conn, $categoryToDelete);

$sql = "DELETE FROM skillKey WHERE category = '$categoryToDelete'";

if ($conn->query($sql) === TRUE) {
    echo "Entries with category '$categoryToDelete' deleted successfully";
} else {
    echo "Error deleting entries: " . $conn->error;
}

$conn->close();
?>
