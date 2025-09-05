# DASD Student Database

A comprehensive PHP-based student grading and attendance tracking system designed for special education programs. This application allows teachers to track student progress across multiple skill categories and generate detailed reports.

## 🎯 Features

- **Student Management**: Add, view, and manage student records
- **Skill Tracking**: Track 12 different skills across 4 categories:
  - **Promptness**: Timely Attendance, Prepared for Class, Follows Daily Routine
  - **Hygiene**: Clean Hands, Personal Care, Healthy Habits
  - **Communication**: Expresses Needs Clearly, Listens to Others, Takes Turns in Conversation
  - **Self-Management**: Follows Directions, Manages Emotions, Stays on Task
- **Attendance Management**: Mark students absent and prevent skill marking on absent days
- **Marking Periods**: Organize data across 4 marking periods throughout the school year
- **Comprehensive Reports**: Generate detailed reports with visual charts and progress tracking
- **Real-time Updates**: Save changes instantly with visual feedback

## 🛠️ Technology Stack

- **Backend**: PHP 8.4+
- **Database**: MySQL 9.4+
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Charts**: Chart.js for data visualization
- **Server**: PHP Built-in Development Server

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **PHP 8.4+** with MySQL extension
- **MySQL 9.4+** or MariaDB
- **Web Browser** (Chrome, Firefox, Safari, Edge)

### macOS Installation

```bash
# Install PHP and MySQL using Homebrew
brew install php mysql

# Start MySQL service
brew services start mysql
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/anuragraychowdhury/dasdDB.git
cd dasdDB
```

### 2. Database Setup

```bash
# Connect to MySQL as root
mysql -u root -p

# Create database and user
CREATE DATABASE id19353024_test;
CREATE USER 'id19353024_testuser'@'localhost' IDENTIFIED BY 'Root_Truss_123';
GRANT ALL PRIVILEGES ON id19353024_test.* TO 'id19353024_testuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Import Database Schema

```bash
# Run the database setup script
mysql -u id19353024_testuser -p'Root_Truss_123' < setup_database.sql
```

### 4. Start the Application

```bash
# Start PHP development server
php -S localhost:8000
```

### 5. Access the Application

Open your web browser and navigate to:
```
http://localhost:8000
```

## 📊 Database Schema

### Tables

1. **studentKey**: Stores student information
   - `student_id` (Primary Key)
   - `student_name`

2. **skillKey**: Stores skills and categories
   - `skill_id` (Primary Key)
   - `skilltag` (Skill name)
   - `category` (Skill category)

3. **mpData**: Stores marking period information
   - `mp_id` (Primary Key)
   - `markingPeriod` (MP1, MP2, MP3, MP4)
   - `MPstartDate`
   - `MPendDate`

4. **gradingTable**: Stores grading records
   - `grading_id` (Primary Key)
   - `student_id` (Foreign Key)
   - `date`
   - `skilltag` (Skill ID)
   - `grade` (1 for marked, 0 for absent)

## 🎮 How to Use

### Adding Students
1. Navigate to the main page
2. Use the "Add Student" functionality
3. Enter student name and save

### Grading Students
1. Click on a student from the main list
2. Select the date for grading
3. Click on skill buttons to mark them as completed (green)
4. Click "Save Changes" to persist the data
5. Use "Manage Absent" to mark a student absent for the day

### Generating Reports
1. Click on a student from the main list
2. Navigate to the "Report" section
3. View comprehensive reports with:
   - Skill progress across marking periods
   - Visual charts showing performance
   - Attendance tracking
   - Category-wise breakdowns

### Managing Skills
- **Add Skills**: Use the "Add Skill" form to add new skills
- **Delete Skills**: Remove skills that are no longer needed
- **Categories**: Organize skills into meaningful categories

## 🔧 Configuration

### Database Connection
The database connection is configured in `dbConnection.php`:

```php
$servername = "localhost";
$username = "id19353024_testuser";
$password = "Root_Truss_123";
$dbname = "id19353024_test";
```

### Marking Periods
Default marking periods are set for the 2025-2026 school year:
- **MP1**: September 1-15, 2025
- **MP2**: September 16-30, 2025
- **MP3**: October 1-15, 2025
- **MP4**: October 16-31, 2025

## 📁 Project Structure

```
dasdDB/
├── index.html              # Main application page
├── gradingKey.html         # Student grading interface
├── gradingReport.html      # Report generation page
├── contextualData.html     # Additional data entry
├── confirmation.html       # Confirmation pages
├── dbConnection.php        # Database connection
├── getStudents.php         # Student data retrieval
├── getGradingButtons.php   # Skill button data
├── saveData.php           # Save grading data
├── markAbsent.php         # Mark student absent
├── checkAbsent.php        # Check absence status
├── attendance.php         # Attendance calculations
├── gradingReport.php      # Report data generation
├── addStudent.php         # Add new students
├── addSkill.php           # Add new skills
├── deleteStudent.php      # Remove students
├── deleteSkill.php        # Remove skills
├── addMpData.php          # Add marking period data
├── studentList.js         # Main page JavaScript
├── gradingKey.js          # Grading interface JavaScript
├── gradingReport.js       # Report JavaScript
├── contextualData.js      # Additional data JavaScript
├── stylesIndex.css        # Main page styles
├── stylesGK.css           # Grading interface styles
├── search_table_style.css # Table styling
└── README.md              # This file
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running: `brew services start mysql`
   - Check database credentials in `dbConnection.php`
   - Ensure database and user exist

2. **Skills Not Saving**
   - Check browser console for JavaScript errors
   - Verify PHP error logs
   - Ensure database permissions are correct

3. **Reports Showing 0/0**
   - Verify marking period dates include your data dates
   - Check that skills are properly marked
   - Ensure attendance data is correct

4. **Buttons Not Turning Green**
   - Clear browser cache
   - Check JavaScript console for errors
   - Verify data is being saved to database

### Debug Mode

Enable PHP error reporting by adding to the top of PHP files:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Anurag Ray Chowdhury**
- GitHub: [@anuragraychowdhury](https://github.com/anuragraychowdhury)

## 🙏 Acknowledgments

- Built for DASD (Developmental and Adaptive Skills Development) programs
- Designed with special education needs in mind
- Inspired by the need for comprehensive student progress tracking

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/anuragraychowdhury/dasdDB/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Happy Teaching! 📚✨**
