<?php
/**
 * Attendance Data API
 * 
 * This file calculates attendance statistics for a specific student across all marking periods.
 * It returns JSON data containing total days and absent days for each marking period,
 * used for generating attendance reports.
 * 
 */

include 'dbConnection.php';

# in a GET, the data is in the URl (fetches data as opposed to submitting data)
$sid = $_GET['student_id']; 

# fetches data that is respective to the marking period
$sqlMarkingPeriods = "SELECT markingPeriod, MPstartDate, MPendDate FROM mpData";
$resultMarkingPeriods = $conn->query($sqlMarkingPeriods);

# array that holds all the data from the marking periods
$allMarkingPeriodsData = array();

# iterates through resultMarkingPeriods query and each row of that is broken up into variables inside the loop
while ($rowMarkingPeriod = $resultMarkingPeriods->fetch_assoc()) {
    $markingPeriod = $rowMarkingPeriod['markingPeriod'];
    $startDate = $rowMarkingPeriod['MPstartDate'];
    $endDate = $rowMarkingPeriod['MPendDate'];

    # SELECT COUNT(DISTINCT date) AS total_unique_dates -> counts all distinct dates that are in the date column
    # SUM(CASE WHEN skilltag = 0 THEN 1 ELSE 0 END) AS total_dates_with_skilltag_0 -> when skilltag is 0, add 1 to sum, else 0; stored in total_dates_with_skilltag_0
    # when the skill tag is 0, that means nothing was selected, hence the attendance here is 1 for skill tag 0 to mark absence
    $sql = "SELECT COUNT(DISTINCT date) AS total_unique_dates, SUM(CASE WHEN skilltag = '0' THEN 1 ELSE 0 END) AS total_dates_with_skilltag_0 
            FROM gradingTable 
            WHERE student_id = $sid 
            AND date >= '$startDate' 
            AND date <= '$endDate'";
    # above there are additional restrictions that we want to enforce to ensure that we are getting the right values
    $result = $conn->query($sql);

    # each row here holds the unique dates and the unique dates w/ skill tag 0 (this was in result)
    # one marking periof is processed (for one student) here and then it is stored in that array
    $currentMarkingPeriodData = array();
    while ($row = $result->fetch_assoc()) {
        $currentMarkingPeriodData[] = $row;
    }

    # eventually, all the marking period data for a student (in terms of attendance) will be stored in the array
    $allMarkingPeriodsData[$markingPeriod] = $currentMarkingPeriodData;
}

echo json_encode($allMarkingPeriodsData);
?>
