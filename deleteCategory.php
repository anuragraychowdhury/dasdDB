<?php
include 'dbConnection.php'; 

# post takes in data submitted from the form (webpage) by the user 
# in this case, it is the category name (since we want to delete a category)
$categoryToDelete = $_POST['CategoryName']; 

# sanitize user inputs to prevent SQL injection attacks
# takes in connection and user provided string that needs sanitation
# makes it so that you cannot input SQL commands themselves into the string (treated as a string)
$categoryToDelete = mysqli_real_escape_string($conn, $categoryToDelete);

# query to delete the entry from the table
$sql = "DELETE FROM skillKey WHERE category = '$categoryToDelete'";

# error handling
if ($conn->query($sql) === TRUE) {
    echo "Entries with category '$categoryToDelete' deleted successfully";
} else {
    echo "Error deleting entries: " . $conn->error;
}

$conn->close();
?>
