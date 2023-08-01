<?php
include 'dbConnection.php';
$sid = $_GET['student_id'];

// Fetch the marking periods start and end dates from the database
$sqlMarkingPeriods = "SELECT markingPeriod, MPstartDate, MPendDate FROM mpData";
$resultMarkingPeriods = $conn->query($sqlMarkingPeriods);

// Array to hold the result data for all marking periods
$allMarkingPeriodsData = array();

while ($rowMarkingPeriod = $resultMarkingPeriods->fetch_assoc()) {
    $markingPeriod = $rowMarkingPeriod['markingPeriod'];
    $startDate = $rowMarkingPeriod['MPstartDate'];
    $endDate = $rowMarkingPeriod['MPendDate'];

    // Query to get attendance data for the current marking period
    $sql = "SELECT COUNT(DISTINCT date) AS total_unique_dates, SUM(CASE WHEN skilltag = 0 THEN 1 ELSE 0 END) AS total_dates_with_skilltag_0 
            FROM gradingTable 
            WHERE student_id = $sid 
            AND date >= '$startDate' 
            AND date <= '$endDate'";

    $result = $conn->query($sql);

    // Fetch the attendance data for the current marking period and store it in an array
    $currentMarkingPeriodData = array();
    while ($row = $result->fetch_assoc()) {
        $currentMarkingPeriodData[] = $row;
    }

    // Add the data for the current marking period to the array of all marking periods' data
    $allMarkingPeriodsData[$markingPeriod] = $currentMarkingPeriodData;
}

echo json_encode($allMarkingPeriodsData);
?>
