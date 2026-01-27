# University Timetable Management System

A comprehensive web-based timetable management system for universities to create, manage, and view class schedules efficiently.

## 🎯 Features

### 1. **Dashboard**
- Real-time statistics showing total courses, instructors, rooms, and scheduled classes
- Quick action buttons for rapid access to main functions
- Overview of system utilization

### 2. **Course Management**
- Add new courses with course code, name, department, and duration
- Specify classes per week
- View all courses in a table format
- Delete courses
- Track course frequency and duration

### 3. **Instructor Management**
- Register instructors with ID, name, department, and email
- Set maximum classes per week for each instructor
- View all instructors with their details
- Delete instructor records
- Track instructor workload

### 4. **Classroom Management**
- Add classrooms with room number, building, capacity, and equipment
- Track available equipment in each room
- Manage room availability
- Delete room records
- View room details and capacity

### 5. **Timetable Creation**
- **Manual Scheduling**: Manually assign courses to instructors, rooms, and time slots
- **Auto-Generate**: Automatically create conflict-free timetables
- **Conflict Detection**: 
  - Prevents instructor double-booking
  - Prevents room double-booking
  - Real-time conflict validation
  - Detailed conflict messages

### 6. **Schedule Viewing**
- **Weekly View**: See all classes for each day of the week
- **Day View**: Detailed view of a specific day's schedule
- **Instructor View**: View each instructor's full schedule
- **Room View**: View each room's schedule and utilization
- Organized card-based interface
- Easy-to-read time and location information

### 7. **Additional Features**
- **Data Persistence**: All data saved to browser's localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Print Support**: Print-friendly timetable views
- **Export Ready**: Structure prepared for PDF export integration
- **Real-time Updates**: Statistics update automatically
- **User-friendly Interface**: Intuitive navigation and clear form layouts

## 🛠️ How to Use

### Getting Started
1. Open `index.html` in a web browser
2. Start from the Dashboard tab to see system overview

### Adding Courses
1. Navigate to **Courses** tab
2. Fill in the course details:
   - Course Code (e.g., CS101)
   - Course Name
   - Department
   - Duration (in minutes)
   - Classes per Week
3. Click **Add Course**
4. View added courses in the table below

### Adding Instructors
1. Go to **Instructors** tab
2. Enter instructor details:
   - Instructor ID
   - Full Name
   - Department
   - Email
   - Maximum Classes per Week
3. Click **Add Instructor**

### Adding Classrooms
1. Navigate to **Rooms** tab
2. Enter room information:
   - Room Number (e.g., A101)
   - Building Name
   - Capacity (number of students)
   - Equipment (optional)
3. Click **Add Room**

### Creating Timetables

#### Manual Scheduling
1. Go to **Timetable** tab
2. Use **Manual Schedule Entry** form:
   - Select a Course
   - Select an Instructor
   - Select a Room
   - Choose Day of Week
   - Set Start and End Times
3. Click **Schedule Class**
4. System checks for conflicts automatically

#### Auto-Generate Timetable
1. Go to **Timetable** tab
2. Click **Auto-Generate Timetable** button
3. System will:
   - Create conflict-free schedules
   - Distribute classes across the week
   - Assign available instructors and rooms
   - Show total classes created

### Viewing Schedules
1. Navigate to **View Schedule** tab
2. Choose a viewing option:
   - **Weekly View**: See Monday-Friday with all classes
   - **Day View**: Select specific day for detailed view
   - **By Instructor**: View each instructor's full schedule
   - **By Room**: View room utilization and bookings
3. Click buttons to switch between views

### Handling Conflicts
If a conflict is detected:
1. A modal will appear showing conflict details
2. Conflicts include:
   - Instructor double-booking
   - Room double-booking
3. Resolve the conflict by:
   - Changing the time slot
   - Selecting a different instructor or room
   - Or using Auto-Generate feature

## 📊 System Capabilities

### Conflict Detection
- ✓ Instructor availability checking
- ✓ Room availability checking
- ✓ Time overlap detection
- ✓ Real-time validation

### Scheduling Flexibility
- ✓ Manual assignment
- ✓ Automatic scheduling
- ✓ Conflict resolution
- ✓ Flexible time slots
- ✓ Multi-day scheduling

### Data Management
- ✓ Add/Delete courses, instructors, rooms
- ✓ View detailed information
- ✓ Track scheduling statistics
- ✓ Persistent storage (localStorage)
- ✓ Data export capability

### User Interface
- ✓ Tab-based navigation
- ✓ Multiple view options
- ✓ Responsive design
- ✓ Quick action buttons
- ✓ Real-time statistics
- ✓ Clear data tables

## 💾 Data Storage

All data is stored in the browser's **localStorage**:
- **courses**: Array of course objects
- **instructors**: Array of instructor objects
- **rooms**: Array of room objects
- **schedules**: Array of schedule/class objects

Data persists even after closing the browser.

## 🔧 Technical Details

### Technology Stack
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with grid and flexbox
- **JavaScript**: Pure vanilla JS (no dependencies)
- **Font Awesome**: Icons (CDN)
- **LocalStorage API**: Data persistence

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full responsive support

### Time Format
- All times use 24-hour format (HH:MM)
- Days: Monday to Friday
- Flexible duration for classes

## 📱 Responsive Design

- **Desktop**: Full multi-column layouts
- **Tablet**: Optimized 2-column grids
- **Mobile**: Single-column responsive layouts
- **Print**: Simplified print-friendly styling

## 🚀 Future Enhancements

Potential features for future versions:
- PDF/Excel export integration
- Student enrollment tracking
- Email notifications
- Database backend integration
- User authentication
- Multi-semester management
- Venue capacity constraints
- Prerequisite tracking
- Performance analytics
- Batch import from CSV

## 📋 Requirements

- Modern web browser
- No server required (client-side only)
- JavaScript enabled
- Browser storage enabled

## 📝 Example Data

### Sample Courses
- **CS101**: Introduction to Programming (Computer Science)
- **MATH201**: Calculus II (Mathematics)
- **ENG101**: English Composition (English)

### Sample Instructors
- Dr. John Smith (Computer Science)
- Prof. Sarah Johnson (Mathematics)
- Prof. Michael Brown (English)

### Sample Rooms
- A101 (Science Building, 40 students, Projector, AC)
- B202 (Library Building, 30 students, Smart Board)
- C103 (Admin Building, 50 students, WiFi)

## 🎓 Use Cases

1. **Department Heads**: Create and manage departmental schedules
2. **Course Coordinators**: Coordinate multi-section courses
3. **Room Managers**: Track and optimize room utilization
4. **Administrators**: Monitor overall timetable efficiency
5. **Students**: View their complete schedule (with enhancement)
6. **Instructors**: Check their teaching assignments

## ⚙️ Tips for Optimal Usage

1. **Add all courses first** before creating schedules
2. **Register all instructors and rooms** before auto-generating
3. **Check conflicts** before finalizing schedules
4. **Review statistics** on dashboard for capacity planning
5. **Use auto-generate** for quick initial scheduling
6. **Fine-tune manually** for specific requirements
7. **Export regularly** for backup purposes

## 📞 Support

For issues or suggestions:
- Check browser console for error messages
- Ensure localStorage is enabled
- Try clearing cache if data seems inconsistent
- Verify all required fields are filled when adding items

## 📄 License

© 2024 University Timetable Management System. All rights reserved.

---

**Version 1.0** - Released January 2026
