<?php
include 'dbConnection.php';

// Retrieve values from the form
$mp1 = $_POST['MP1'];
$startDate1 = $_POST['StartDate1'];
$endDate1 = $_POST['EndDate1'];

$mp2 = $_POST['MP2'];
$startDate2 = $_POST['StartDate2'];
$endDate2 = $_POST['EndDate2'];

$mp3 = $_POST['MP3'];
$startDate3 = $_POST['StartDate3'];
$endDate3 = $_POST['EndDate3'];

$mp4 = $_POST['MP4'];
$startDate4 = $_POST['StartDate4'];
$endDate4 = $_POST['EndDate4'];

// SQL statement to insert the Marking Period data
$sql = "INSERT INTO mpData (markingPeriod, MPstartDate, MPendDate)
        VALUES
        ('$mp1', '$startDate1', '$endDate1'),
        ('$mp2', '$startDate2', '$endDate2'),
        ('$mp3', '$startDate3', '$endDate3'),
        ('$mp4', '$startDate4', '$endDate4')";

// Execute the SQL query
if (mysqli_query($conn, $sql)) {
    echo "Data inserted successfully.";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

// Close the database connection
mysqli_close($conn);
?>
