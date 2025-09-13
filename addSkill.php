<?php
/**
 * Add Skill API
 * 
 * This file handles adding new skills to the database. It receives skill name and
 * category data via POST request and inserts a new record into the skillKey table.
 * 
 * @author Anurag Ray Chowdhury
 * @version 1.0
 */

include 'dbConnection.php';

# obtain the skill and category from the forms and assign to variable
$skill = $_POST['AddSkill'];
$category = $_POST['AddCategory'];

# insert obtained values into the skillKey table and the relevant categories
$sql = "INSERT INTO skillKey(skill, category) VALUES ('$skill', '$category')";

# error handling
if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
