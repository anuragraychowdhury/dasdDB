<?php
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
