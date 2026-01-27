// ===========================
// Data Storage
// ===========================
let courses = JSON.parse(localStorage.getItem('courses')) || [];
let instructors = JSON.parse(localStorage.getItem('instructors')) || [];
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
let schedules = JSON.parse(localStorage.getItem('schedules')) || [];

// ===========================
// Initialize
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    displayDashboard();
    updateDashboardStats();
});

// ===========================
// Tab Navigation
// ===========================
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            switchTab(tab);
            updateNavActive(link);
        });
    });

    // Forms
    document.getElementById('courseForm').addEventListener('submit', addCourse);
    document.getElementById('instructorForm').addEventListener('submit', addInstructor);
    document.getElementById('roomForm').addEventListener('submit', addRoom);
    document.getElementById('scheduleForm').addEventListener('submit', addSchedule);
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Update content
    if (tabName === 'courses') {
        displayCourses();
    } else if (tabName === 'instructors') {
        displayInstructors();
    } else if (tabName === 'rooms') {
        displayRooms();
    } else if (tabName === 'timetable') {
        displayTimetable();
    } else if (tabName === 'view') {
        displayWeeklyView();
    } else if (tabName === 'dashboard') {
        displayDashboard();
    }
}

function updateNavActive(clickedLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    clickedLink.classList.add('active');
}

// ===========================
// Dashboard
// ===========================
function displayDashboard() {
    updateDashboardStats();
}

function updateDashboardStats() {
    document.getElementById('courseCount').textContent = courses.length;
    document.getElementById('instructorCount').textContent = instructors.length;
    document.getElementById('roomCount').textContent = rooms.length;
    document.getElementById('scheduleCount').textContent = schedules.length;
}

// ===========================
// Courses
// ===========================
function displayCourses() {
    updateCoursesDropdown();
    displayCoursesList();
}

function addCourse(e) {
    e.preventDefault();

    const course = {
        id: Date.now(),
        code: document.getElementById('courseCode').value,
        name: document.getElementById('courseName').value,
        department: document.getElementById('courseDept').value,
        duration: parseInt(document.getElementById('courseDuration').value),
        frequency: parseInt(document.getElementById('courseFrequency').value)
    };

    courses.push(course);
    localStorage.setItem('courses', JSON.stringify(courses));
    document.getElementById('courseForm').reset();
    displayCoursesList();
    updateCoursesDropdown();
    updateDashboardStats();
    showSuccess('Course added successfully!');
}

function displayCoursesList() {
    const tbody = document.getElementById('coursesBody');
    tbody.innerHTML = '';

    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No courses added yet</td></tr>';
        return;
    }

    courses.forEach(course => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.department}</td>
            <td>${course.duration} min</td>
            <td>${course.frequency}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-delete" onclick="deleteCourse(${course.id})">Delete</button>
                </div>
            </td>
        `;
    });
}

function deleteCourse(id) {
    if (confirm('Delete this course?')) {
        courses = courses.filter(c => c.id !== id);
        localStorage.setItem('courses', JSON.stringify(courses));
        displayCoursesList();
        updateDashboardStats();
    }
}

function updateCoursesDropdown() {
    const select = document.getElementById('scheduleCourseName');
    select.innerHTML = '<option value="">Select a course...</option>';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = `${course.code} - ${course.name}`;
        select.appendChild(option);
    });
}

// ===========================
// Instructors
// ===========================
function displayInstructors() {
    updateInstructorsDropdown();
    displayInstructorsList();
}

function addInstructor(e) {
    e.preventDefault();

    const instructor = {
        id: Date.now(),
        instrId: document.getElementById('instructorId').value,
        name: document.getElementById('instructorName').value,
        department: document.getElementById('instructorDept').value,
        email: document.getElementById('instructorEmail').value,
        maxClasses: parseInt(document.getElementById('instructorMaxClasses').value),
        currentClasses: 0
    };

    instructors.push(instructor);
    localStorage.setItem('instructors', JSON.stringify(instructors));
    document.getElementById('instructorForm').reset();
    displayInstructorsList();
    updateInstructorsDropdown();
    updateDashboardStats();
    showSuccess('Instructor added successfully!');
}

function displayInstructorsList() {
    const tbody = document.getElementById('instructorsBody');
    tbody.innerHTML = '';

    if (instructors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No instructors added yet</td></tr>';
        return;
    }

    instructors.forEach(instructor => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${instructor.instrId}</td>
            <td>${instructor.name}</td>
            <td>${instructor.department}</td>
            <td>${instructor.email}</td>
            <td>${instructor.maxClasses}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-delete" onclick="deleteInstructor(${instructor.id})">Delete</button>
                </div>
            </td>
        `;
    });
}

function deleteInstructor(id) {
    if (confirm('Delete this instructor?')) {
        instructors = instructors.filter(i => i.id !== id);
        localStorage.setItem('instructors', JSON.stringify(instructors));
        displayInstructorsList();
        updateDashboardStats();
    }
}

function updateInstructorsDropdown() {
    const select = document.getElementById('scheduleInstructor');
    select.innerHTML = '<option value="">Select an instructor...</option>';
    instructors.forEach(instructor => {
        const option = document.createElement('option');
        option.value = instructor.id;
        option.textContent = instructor.name;
        select.appendChild(option);
    });
}

// ===========================
// Rooms
// ===========================
function displayRooms() {
    updateRoomsDropdown();
    displayRoomsList();
}

function addRoom(e) {
    e.preventDefault();

    const room = {
        id: Date.now(),
        number: document.getElementById('roomNumber').value,
        building: document.getElementById('roomBuilding').value,
        capacity: parseInt(document.getElementById('roomCapacity').value),
        equipment: document.getElementById('roomEquipment').value
    };

    rooms.push(room);
    localStorage.setItem('rooms', JSON.stringify(rooms));
    document.getElementById('roomForm').reset();
    displayRoomsList();
    updateRoomsDropdown();
    updateDashboardStats();
    showSuccess('Room added successfully!');
}

function displayRoomsList() {
    const tbody = document.getElementById('roomsBody');
    tbody.innerHTML = '';

    if (rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No rooms added yet</td></tr>';
        return;
    }

    rooms.forEach(room => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${room.number}</td>
            <td>${room.building}</td>
            <td>${room.capacity}</td>
            <td>${room.equipment || 'N/A'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-delete" onclick="deleteRoom(${room.id})">Delete</button>
                </div>
            </td>
        `;
    });
}

function deleteRoom(id) {
    if (confirm('Delete this room?')) {
        rooms = rooms.filter(r => r.id !== id);
        localStorage.setItem('rooms', JSON.stringify(rooms));
        displayRoomsList();
        updateDashboardStats();
    }
}

function updateRoomsDropdown() {
    const select = document.getElementById('scheduleRoom');
    select.innerHTML = '<option value="">Select a room...</option>';
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = `${room.number} (${room.building})`;
        select.appendChild(option);
    });
}

// ===========================
// Timetable / Schedule
// ===========================
function displayTimetable() {
    updateCoursesDropdown();
    updateInstructorsDropdown();
    updateRoomsDropdown();
    displaySchedulesList();
}

function addSchedule(e) {
    e.preventDefault();

    const courseId = document.getElementById('scheduleCourseName').value;
    const instructorId = document.getElementById('scheduleInstructor').value;
    const roomId = document.getElementById('scheduleRoom').value;
    const day = document.getElementById('scheduleDay').value;
    const startTime = document.getElementById('scheduleStartTime').value;
    const endTime = document.getElementById('scheduleEndTime').value;

    // Validate selection
    if (!courseId || !instructorId || !roomId || !day || !startTime || !endTime) {
        alert('Please fill all fields');
        return;
    }

    // Check conflicts
    const conflicts = checkConflicts(courseId, instructorId, roomId, day, startTime, endTime);
    if (conflicts.length > 0) {
        showConflictModal(conflicts);
        return;
    }

    const schedule = {
        id: Date.now(),
        courseId: parseInt(courseId),
        instructorId: parseInt(instructorId),
        roomId: parseInt(roomId),
        day: day,
        startTime: startTime,
        endTime: endTime
    };

    schedules.push(schedule);
    localStorage.setItem('schedules', JSON.stringify(schedules));
    document.getElementById('scheduleForm').reset();
    displaySchedulesList();
    updateDashboardStats();
    showSuccess('Class scheduled successfully!');
}

function displaySchedulesList() {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    if (schedules.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No classes scheduled yet</td></tr>';
        return;
    }

    schedules.forEach(schedule => {
        const course = courses.find(c => c.id === schedule.courseId);
        const instructor = instructors.find(i => i.id === schedule.instructorId);
        const room = rooms.find(r => r.id === schedule.roomId);

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${course ? course.name : 'N/A'}</td>
            <td>${instructor ? instructor.name : 'N/A'}</td>
            <td>${room ? room.number : 'N/A'}</td>
            <td>${schedule.day}</td>
            <td>${schedule.startTime} - ${schedule.endTime}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-delete" onclick="deleteSchedule(${schedule.id})">Delete</button>
                </div>
            </td>
        `;
    });
}

function deleteSchedule(id) {
    if (confirm('Delete this class?')) {
        schedules = schedules.filter(s => s.id !== id);
        localStorage.setItem('schedules', JSON.stringify(schedules));
        displaySchedulesList();
        updateDashboardStats();
    }
}

// ===========================
// Conflict Detection
// ===========================
function checkConflicts(courseId, instructorId, roomId, day, startTime, endTime) {
    const conflicts = [];

    schedules.forEach(schedule => {
        // Check instructor conflict
        if (schedule.instructorId === parseInt(instructorId) && schedule.day === day) {
            if (timesOverlap(startTime, endTime, schedule.startTime, schedule.endTime)) {
                const course = courses.find(c => c.id === schedule.courseId);
                conflicts.push(`Instructor conflict: Already teaching ${course.name} at this time`);
            }
        }

        // Check room conflict
        if (schedule.roomId === parseInt(roomId) && schedule.day === day) {
            if (timesOverlap(startTime, endTime, schedule.startTime, schedule.endTime)) {
                const course = courses.find(c => c.id === schedule.courseId);
                conflicts.push(`Room conflict: Already in use for ${course.name} at this time`);
            }
        }
    });

    return [...new Set(conflicts)]; // Remove duplicates
}

function timesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && end1 > start2;
}

function showConflictModal(conflicts) {
    const conflictList = document.getElementById('conflictList');
    conflictList.innerHTML = '';
    conflicts.forEach(conflict => {
        const div = document.createElement('div');
        div.className = 'conflict-item';
        div.innerHTML = `<strong>⚠</strong> ${conflict}`;
        conflictList.appendChild(div);
    });
    document.getElementById('conflictModal').classList.remove('hidden');
}

function closeConflictModal() {
    document.getElementById('conflictModal').classList.add('hidden');
}

// ===========================
// View Schedule
// ===========================
function displayWeeklyView() {
    const viewBtn = event.target.closest('.btn');
    if (viewBtn) {
        document.querySelectorAll('.view-options .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        viewBtn.classList.add('active');
    }

    const container = document.getElementById('weeklyView');
    container.innerHTML = '';

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const weekGrid = document.createElement('div');
    weekGrid.className = 'week-grid';

    days.forEach(day => {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';

        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        dayColumn.appendChild(dayHeader);

        const daySchedule = document.createElement('div');
        daySchedule.className = 'day-schedule';

        const daySchedules = schedules.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));

        if (daySchedules.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-slot';
            empty.textContent = 'No classes';
            daySchedule.appendChild(empty);
        } else {
            daySchedules.forEach(schedule => {
                const course = courses.find(c => c.id === schedule.courseId);
                const instructor = instructors.find(i => i.id === schedule.instructorId);
                const room = rooms.find(r => r.id === schedule.roomId);

                const slot = document.createElement('div');
                slot.className = 'schedule-slot';
                slot.innerHTML = `
                    <div class="slot-time">${schedule.startTime} - ${schedule.endTime}</div>
                    <div class="slot-course">${course ? course.name : 'N/A'}</div>
                    <div class="slot-instructor">${instructor ? instructor.name : 'N/A'}</div>
                    <div class="slot-room">${room ? room.number : 'N/A'}</div>
                `;
                daySchedule.appendChild(slot);
            });
        }

        dayColumn.appendChild(daySchedule);
        weekGrid.appendChild(dayColumn);
    });

    container.appendChild(weekGrid);
}

function displayDayView() {
    const container = document.getElementById('dayView');
    container.innerHTML = '';

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const select = document.createElement('select');
    select.style.marginBottom = '20px';
    select.style.padding = '10px';
    select.style.borderRadius = '8px';
    select.style.border = '2px solid #e5e7eb';
    select.style.width = '100%';
    select.onchange = () => {
        const selectedDay = select.value;
        displayDaySchedule(selectedDay);
    };

    days.forEach(day => {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        select.appendChild(option);
    });

    container.appendChild(select);

    const scheduleContainer = document.createElement('div');
    scheduleContainer.id = 'dayScheduleContainer';
    container.appendChild(scheduleContainer);

    displayDaySchedule(days[0]);
}

function displayDaySchedule(day) {
    const container = document.getElementById('dayScheduleContainer');
    container.innerHTML = '';

    const daySchedules = schedules.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (daySchedules.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No classes scheduled for this day</p>';
        return;
    }

    daySchedules.forEach(schedule => {
        const course = courses.find(c => c.id === schedule.courseId);
        const instructor = instructors.find(i => i.id === schedule.instructorId);
        const room = rooms.find(r => r.id === schedule.roomId);

        const card = document.createElement('div');
        card.style.background = '#f9fafb';
        card.style.padding = '20px';
        card.style.marginBottom = '15px';
        card.style.borderLeft = '4px solid #2563eb';
        card.style.borderRadius = '8px';
        card.innerHTML = `
            <div style="font-weight: 600; color: #1f2937; margin-bottom: 10px;">${course ? course.name : 'N/A'}</div>
            <div style="color: #6b7280; margin-bottom: 8px;"><strong>Time:</strong> ${schedule.startTime} - ${schedule.endTime}</div>
            <div style="color: #6b7280; margin-bottom: 8px;"><strong>Instructor:</strong> ${instructor ? instructor.name : 'N/A'}</div>
            <div style="color: #6b7280;"><strong>Room:</strong> ${room ? room.number : 'N/A'}</div>
        `;
        container.appendChild(card);
    });
}

function displayInstructorView() {
    const container = document.getElementById('instructorView');
    container.innerHTML = '';

    if (instructors.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No instructors available</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    grid.style.gap = '20px';

    instructors.forEach(instructor => {
        const instructorSchedules = schedules.filter(s => s.instructorId === instructor.id).sort((a, b) => {
            const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.startTime.localeCompare(b.startTime);
        });

        const card = document.createElement('div');
        card.style.background = '#f9fafb';
        card.style.padding = '20px';
        card.style.borderRadius = '12px';
        card.style.border = '2px solid #e5e7eb';

        let html = `<h3 style="color: #1f2937; margin-bottom: 15px;">${instructor.name}</h3>`;
        html += `<p style="color: #6b7280; margin-bottom: 15px;"><strong>Department:</strong> ${instructor.department}</p>`;

        if (instructorSchedules.length === 0) {
            html += '<p style="color: #999;">No classes scheduled</p>';
        } else {
            html += '<div>';
            instructorSchedules.forEach(schedule => {
                const course = courses.find(c => c.id === schedule.courseId);
                const room = rooms.find(r => r.id === schedule.roomId);
                html += `
                    <div style="background: white; padding: 10px; margin-bottom: 10px; border-radius: 6px;">
                        <div style="font-weight: 600; color: #1f2937;">${course ? course.name : 'N/A'}</div>
                        <div style="color: #6b7280; font-size: 0.9rem;">${schedule.day}, ${schedule.startTime} - ${schedule.endTime}</div>
                        <div style="color: #6b7280; font-size: 0.9rem;">Room: ${room ? room.number : 'N/A'}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        card.innerHTML = html;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function displayRoomView() {
    const container = document.getElementById('roomView');
    container.innerHTML = '';

    if (rooms.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No rooms available</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    grid.style.gap = '20px';

    rooms.forEach(room => {
        const roomSchedules = schedules.filter(s => s.roomId === room.id).sort((a, b) => {
            const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.startTime.localeCompare(b.startTime);
        });

        const card = document.createElement('div');
        card.style.background = '#f9fafb';
        card.style.padding = '20px';
        card.style.borderRadius = '12px';
        card.style.border = '2px solid #e5e7eb';

        let html = `<h3 style="color: #1f2937; margin-bottom: 15px;">${room.number}</h3>`;
        html += `<p style="color: #6b7280; margin-bottom: 10px;"><strong>Building:</strong> ${room.building}</p>`;
        html += `<p style="color: #6b7280; margin-bottom: 15px;"><strong>Capacity:</strong> ${room.capacity} students</p>`;

        if (roomSchedules.length === 0) {
            html += '<p style="color: #999;">No classes scheduled</p>';
        } else {
            html += '<div>';
            roomSchedules.forEach(schedule => {
                const course = courses.find(c => c.id === schedule.courseId);
                const instructor = instructors.find(i => i.id === schedule.instructorId);
                html += `
                    <div style="background: white; padding: 10px; margin-bottom: 10px; border-radius: 6px;">
                        <div style="font-weight: 600; color: #1f2937;">${course ? course.name : 'N/A'}</div>
                        <div style="color: #6b7280; font-size: 0.9rem;">${schedule.day}, ${schedule.startTime} - ${schedule.endTime}</div>
                        <div style="color: #6b7280; font-size: 0.9rem;">Instructor: ${instructor ? instructor.name : 'N/A'}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        card.innerHTML = html;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

// ===========================
// Auto-Generate Timetable
// ===========================
function generateTimetable() {
    if (courses.length === 0 || instructors.length === 0 || rooms.length === 0) {
        alert('Please add courses, instructors, and rooms first');
        return;
    }

    // Clear existing schedules
    schedules = [];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

    let slotIndex = 0;
    courses.forEach(course => {
        for (let i = 0; i < course.frequency; i++) {
            if (slotIndex >= timeSlots.length * days.length) break;

            const dayIndex = Math.floor(slotIndex / timeSlots.length) % days.length;
            const timeIndex = slotIndex % timeSlots.length;

            const day = days[dayIndex];
            const startTime = timeSlots[timeIndex];
            const endHour = parseInt(startTime.split(':')[0]) + Math.ceil(course.duration / 60);
            const endTime = String(endHour).padStart(2, '0') + ':00';

            const instructor = instructors[i % instructors.length];
            const room = rooms[i % rooms.length];

            const conflicts = checkConflicts(course.id, instructor.id, room.id, day, startTime, endTime);
            if (conflicts.length === 0) {
                schedules.push({
                    id: Date.now() + Math.random(),
                    courseId: course.id,
                    instructorId: instructor.id,
                    roomId: room.id,
                    day: day,
                    startTime: startTime,
                    endTime: endTime
                });
                slotIndex++;
            } else {
                // Try next slot
                slotIndex++;
                i--;
            }
        }
    });

    localStorage.setItem('schedules', JSON.stringify(schedules));
    displaySchedulesList();
    updateDashboardStats();
    showSuccess(`Timetable generated with ${schedules.length} classes!`);
}

// ===========================
// Export & Print
// ===========================
function exportTimetable() {
    alert('Export feature would integrate with a PDF library like jsPDF');
}

function printTimetable() {
    window.print();
}

// ===========================
// Modals
// ===========================
function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hidden');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');
}

// ===========================
// Initial Setup
// ===========================
function openAddCourseModal() {
    switchTab('courses');
    document.getElementById('courseForm').reset();
}

function openAddInstructorModal() {
    switchTab('instructors');
    document.getElementById('instructorForm').reset();
}

function openAddRoomModal() {
    switchTab('rooms');
    document.getElementById('roomForm').reset();
}
