<?php
/**
 * Add Marking Period Data API
 * 
 * This file handles adding marking period data to the database. It receives marking period
 * names and their corresponding start/end dates via POST request and inserts all four
 * marking periods into the mpData table in a single operation.
 * 
 */

include 'dbConnection.php';

# obtain MP start date and end date from the form 
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

# insert into the mpData table all relevant pieces that we had from above
$sql = "INSERT INTO mpData (markingPeriod, MPstartDate, MPendDate)
        VALUES
        ('$mp1', '$startDate1', '$endDate1'),
        ('$mp2', '$startDate2', '$endDate2'),
        ('$mp3', '$startDate3', '$endDate3'),
        ('$mp4', '$startDate4', '$endDate4')";

# executes the sql query and checks if it processed correctly
# another way to check if the sql query worked or not (different from other adds); procedural vs object oriented
if (mysqli_query($conn, $sql)) {
    echo "Data inserted successfully.";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

# as a part of mysqli_query, need to close the connection after use
mysqli_close($conn);
?>
