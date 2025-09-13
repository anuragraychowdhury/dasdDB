<?php
/**
 * Database Connection File
 * 
 * This file establishes the connection to the MySQL database used by the DASD Student Database.
 * It contains the database credentials and creates a mysqli connection object that is used
 * throughout the application for all database operations.
 * 
 * @author Anurag Ray Chowdhury
 * @version 1.0
 */

#server specific data that can be changed if the location of the database changes
$servername = "localhost";
$dbname   = "id19353024_test";
$username = "id19353024_testuser";
$password = "Root_Truss_123";

# creating a new instance of mysqli class (connection to a SQL Database)
# takes in these 4 parameters: $servername, $username, $password, $dbname
# upon succesful authentication, the $conn object represents connection to database

$conn = new mysqli($servername, $username, $password,$dbname); 

# error handling under the situation that the connection was not done properly

if ($conn->connect_error) 
{
  die("Connection failed: " . $conn->connect_error);
}
?>