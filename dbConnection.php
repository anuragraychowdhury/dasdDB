<?php
$servername = "localhost";
$dbname   = "id19353024_test";
$username = "id19353024_testuser";
$password = "Root_Truss_123";

// Create connection
$conn = new mysqli($servername, $username, $password,$dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>