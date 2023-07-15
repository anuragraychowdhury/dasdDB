<?php
include 'dbConnection.php';

$skill = $_POST['AddSkill'];
$category = $_POST['AddCategory'];

$sql = "INSERT INTO skillKey(skill, category) VALUES ('$skill', '$category')";

if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
