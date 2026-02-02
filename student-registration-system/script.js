/**
 * Student Registration System - JavaScript
 * Vanilla JS, no dependencies
 */

// ===================================
// Student Data Management
// ===================================

class StudentRegistry {
    constructor() {
        this.students = this.loadFromStorage();
        this.nextId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1000;
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('students');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading data:', e);
            return [];
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('students', JSON.stringify(this.students));
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    addStudent(data) {
        const student = {
            id: this.nextId++,
            ...data,
            registeredDate: new Date().toISOString()
        };
        this.students.push(student);
        this.saveToStorage();
        return student;
    }

    updateStudent(id, data) {
        const index = this.students.findIndex(s => s.id === id);
        if (index !== -1) {
            this.students[index] = { ...this.students[index], ...data };
            this.saveToStorage();
            return this.students[index];
        }
        return null;
    }

    deleteStudent(id) {
        const index = this.students.findIndex(s => s.id === id);
        if (index !== -1) {
            this.students.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    getStudent(id) {
        return this.students.find(s => s.id === id);
    }

    getAllStudents() {
        return this.students;
    }

    searchStudents(query) {
        const q = query.toLowerCase();
        return this.students.filter(s =>
            s.fullName.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.id.toString().includes(q)
        );
    }

    sortStudents(field, order = 'asc') {
        const sorted = [...this.students];
        sorted.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (order === 'asc') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });
        return sorted;
    }
}

// ===================================
// Form Validation
// ===================================

class FormValidator {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    static validateGPA(gpa) {
        return gpa >= 0 && gpa <= 4;
    }

    static validateAge(dob) {
        const age = new Date().getFullYear() - new Date(dob).getFullYear();
        return age >= 16;
    }

    static validateForm(formData) {
        const errors = {};

        if (!formData.fullName.trim()) {
            errors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!this.validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!this.validatePhone(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }

        if (!formData.dob) {
            errors.dob = 'Date of birth is required';
        } else if (!this.validateAge(formData.dob)) {
            errors.dob = 'You must be at least 16 years old';
        }

        if (!formData.address.trim()) {
            errors.address = 'Address is required';
        }

        if (!formData.city.trim()) {
            errors.city = 'City is required';
        }

        if (!formData.state.trim()) {
            errors.state = 'State/Province is required';
        }

        if (!formData.zip.trim()) {
            errors.zip = 'ZIP code is required';
        }

        if (!formData.country.trim()) {
            errors.country = 'Country is required';
        }

        if (!formData.major) {
            errors.major = 'Major is required';
        }

        if (!formData.year) {
            errors.year = 'Year level is required';
        }

        if (!formData.gpa) {
            errors.gpa = 'GPA is required';
        } else if (!this.validateGPA(parseFloat(formData.gpa))) {
            errors.gpa = 'GPA must be between 0 and 4';
        }

        if (!formData.enrollmentDate) {
            errors.enrollmentDate = 'Enrollment date is required';
        }

        return errors;
    }
}

// ===================================
// UI Manager
// ===================================

class UIManager {
    constructor(registry) {
        this.registry = registry;
        this.currentSort = { field: 'id', order: 'asc' };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStudentsTable();
        this.updateStatistics();
    }

    setupEventListeners() {
        // Tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabChange(e));
        });

        // Registration form
        const registrationForm = document.getElementById('registrationForm');
        registrationForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        registrationForm.addEventListener('reset', () => this.clearErrors());

        // Search
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e));

        // Sort headers
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', (e) => this.handleSort(e));
        });

        // Mobile menu
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToCSV());
        }

        // Delete all button
        const deleteAllBtn = document.getElementById('deleteAllBtn');
        if (deleteAllBtn) {
            deleteAllBtn.addEventListener('click', () => this.confirmDeleteAll());
        }

        // Edit modal
        const editModal = document.getElementById('editModal');
        const editForm = document.getElementById('editForm');
        const cancelEdit = document.getElementById('cancelEdit');
        
        editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
        cancelEdit.addEventListener('click', () => editModal.close());
        document.querySelector('.modal-close').addEventListener('click', () => editModal.close());

        // Confirm modal
        const confirmModal = document.getElementById('confirmModal');
        const confirmBtn = document.getElementById('confirmBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        
        cancelBtn.addEventListener('click', () => confirmModal.close());
    }

    handleTabChange(e) {
        const tabName = e.currentTarget.dataset.tab;

        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('aria-selected', 'true');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        if (tabName === 'statistics') {
            this.updateStatistics();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        const errors = FormValidator.validateForm(data);

        if (Object.keys(errors).length > 0) {
            this.displayErrors(errors);
            return;
        }

        try {
            this.registry.addStudent(data);
            this.showSuccessMessage('Student registered successfully!');
            e.target.reset();
            this.clearErrors();
            this.loadStudentsTable();
            this.updateStatistics();
        } catch (error) {
            this.showErrorMessage('Error registering student: ' + error.message);
        }
    }

    displayErrors(errors) {
        this.clearErrors();

        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(field + 'Error');
            if (errorElement) {
                errorElement.textContent = errors[field];
            }
        });

        this.showErrorMessage('Please correct the errors below');
        document.getElementById('errorMessage').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    clearErrors() {
        document.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
        });
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
    }

    showSuccessMessage(message) {
        const successMsg = document.getElementById('successMessage');
        document.getElementById('successText').textContent = message;
        successMsg.style.display = 'flex';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    }

    showErrorMessage(message) {
        const errorMsg = document.getElementById('errorMessage');
        document.getElementById('errorText').textContent = message;
        errorMsg.style.display = 'flex';
    }

    loadStudentsTable() {
        const students = this.registry.getAllStudents();

        if (students.length === 0) {
            document.getElementById('emptyState').style.display = 'block';
            document.getElementById('tableWrapper').style.display = 'none';
            document.getElementById('bulkActions').style.display = 'none';
            return;
        }

        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('tableWrapper').style.display = 'block';
        document.getElementById('bulkActions').style.display = 'flex';

        const studentsList = document.getElementById('studentsList');
        studentsList.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.fullName}</td>
                <td><a href="mailto:${student.email}">${student.email}</a></td>
                <td>${student.major}</td>
                <td>${student.year}</td>
                <td>${parseFloat(student.gpa).toFixed(2)}</td>
                <td>
                    <div class="student-actions">
                        <button class="action-btn action-btn-edit" onclick="ui.editStudent(${student.id})">Edit</button>
                        <button class="action-btn action-btn-delete" onclick="ui.deleteStudent(${student.id})">Delete</button>
                    </div>
                </td>
            `;
            studentsList.appendChild(row);
        });
    }

    editStudent(id) {
        const student = this.registry.getStudent(id);
        if (!student) return;

        document.getElementById('editStudentId').value = id;
        document.getElementById('editFullName').value = student.fullName;
        document.getElementById('editEmail').value = student.email;
        document.getElementById('editGPA').value = student.gpa;

        document.getElementById('editModal').showModal();
    }

    handleEditSubmit(e) {
        e.preventDefault();

        const id = parseInt(document.getElementById('editStudentId').value);
        const data = {
            fullName: document.getElementById('editFullName').value,
            email: document.getElementById('editEmail').value,
            gpa: document.getElementById('editGPA').value
        };

        this.registry.updateStudent(id, data);
        document.getElementById('editModal').close();
        this.showSuccessMessage('Student updated successfully!');
        this.loadStudentsTable();
        this.updateStatistics();
    }

    deleteStudent(id) {
        const confirmModal = document.getElementById('confirmModal');
        document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this student?';
        
        const confirmBtn = document.getElementById('confirmBtn');
        confirmBtn.onclick = () => {
            this.registry.deleteStudent(id);
            confirmModal.close();
            this.showSuccessMessage('Student deleted successfully!');
            this.loadStudentsTable();
            this.updateStatistics();
        };

        confirmModal.showModal();
    }

    confirmDeleteAll() {
        const confirmModal = document.getElementById('confirmModal');
        document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete ALL students? This cannot be undone.';
        
        const confirmBtn = document.getElementById('confirmBtn');
        confirmBtn.onclick = () => {
            this.registry.students = [];
            this.registry.saveToStorage();
            confirmModal.close();
            this.showSuccessMessage('All students deleted!');
            this.loadStudentsTable();
            this.updateStatistics();
        };

        confirmModal.showModal();
    }

    handleSearch(e) {
        const query = e.target.value;
        const results = query ? this.registry.searchStudents(query) : this.registry.getAllStudents();

        const studentsList = document.getElementById('studentsList');
        studentsList.innerHTML = '';

        results.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.fullName}</td>
                <td><a href="mailto:${student.email}">${student.email}</a></td>
                <td>${student.major}</td>
                <td>${student.year}</td>
                <td>${parseFloat(student.gpa).toFixed(2)}</td>
                <td>
                    <div class="student-actions">
                        <button class="action-btn action-btn-edit" onclick="ui.editStudent(${student.id})">Edit</button>
                        <button class="action-btn action-btn-delete" onclick="ui.deleteStudent(${student.id})">Delete</button>
                    </div>
                </td>
            `;
            studentsList.appendChild(row);
        });
    }

    handleSort(e) {
        const field = e.currentTarget.dataset.sort;
        const order = this.currentSort.field === field && this.currentSort.order === 'asc' ? 'desc' : 'asc';
        this.currentSort = { field, order };

        const sorted = this.registry.sortStudents(field, order);

        const studentsList = document.getElementById('studentsList');
        studentsList.innerHTML = '';

        sorted.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.fullName}</td>
                <td><a href="mailto:${student.email}">${student.email}</a></td>
                <td>${student.major}</td>
                <td>${student.year}</td>
                <td>${parseFloat(student.gpa).toFixed(2)}</td>
                <td>
                    <div class="student-actions">
                        <button class="action-btn action-btn-edit" onclick="ui.editStudent(${student.id})">Edit</button>
                        <button class="action-btn action-btn-delete" onclick="ui.deleteStudent(${student.id})">Delete</button>
                    </div>
                </td>
            `;
            studentsList.appendChild(row);
        });
    }

    updateStatistics() {
        const students = this.registry.getAllStudents();

        document.getElementById('totalStudents').textContent = students.length;

        if (students.length === 0) {
            document.getElementById('averageGPA').textContent = '0.00';
            document.getElementById('highestGPA').textContent = '0.00';
            document.getElementById('commonMajor').textContent = '-';
            document.getElementById('majorList').innerHTML = '<p>No data</p>';
            document.getElementById('yearList').innerHTML = '<p>No data</p>';
            return;
        }

        // Average GPA
        const avgGPA = students.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / students.length;
        document.getElementById('averageGPA').textContent = avgGPA.toFixed(2);

        // Highest GPA
        const highestGPA = Math.max(...students.map(s => parseFloat(s.gpa)));
        document.getElementById('highestGPA').textContent = highestGPA.toFixed(2);

        // Most common major
        const majors = {};
        students.forEach(s => {
            majors[s.major] = (majors[s.major] || 0) + 1;
        });
        const commonMajor = Object.keys(majors).reduce((a, b) => majors[a] > majors[b] ? a : b);
        document.getElementById('commonMajor').textContent = commonMajor;

        // Major distribution
        this.updateMajorDistribution(majors);

        // Year distribution
        const years = {};
        students.forEach(s => {
            years[s.year] = (years[s.year] || 0) + 1;
        });
        this.updateYearDistribution(years);
    }

    updateMajorDistribution(majors) {
        const majorList = document.getElementById('majorList');
        majorList.innerHTML = '';

        const maxCount = Math.max(...Object.values(majors));

        Object.entries(majors).forEach(([major, count]) => {
            const percentage = (count / maxCount) * 100;
            const item = document.createElement('div');
            item.className = 'major-item';
            item.innerHTML = `
                <span class="major-name">${major}</span>
                <div class="major-bar">
                    <div class="major-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="major-count">${count}</span>
            `;
            majorList.appendChild(item);
        });
    }

    updateYearDistribution(years) {
        const yearList = document.getElementById('yearList');
        yearList.innerHTML = '';

        const maxCount = Math.max(...Object.values(years));

        Object.entries(years).forEach(([year, count]) => {
            const percentage = (count / maxCount) * 100;
            const item = document.createElement('div');
            item.className = 'year-item';
            item.innerHTML = `
                <span class="year-name">${year}</span>
                <div class="year-bar">
                    <div class="year-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="year-count">${count}</span>
            `;
            yearList.appendChild(item);
        });
    }

    exportToCSV() {
        const students = this.registry.getAllStudents();
        if (students.length === 0) {
            alert('No students to export');
            return;
        }

        const headers = Object.keys(students[0]);
        const rows = students.map(s => headers.map(h => {
            const value = s[h];
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
            }
            return value;
        }));

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students_' + new Date().toISOString().split('T')[0] + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    toggleMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

        menuToggle.setAttribute('aria-expanded', !isOpen);
        navMenu.classList.toggle('active');
    }

    closeMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    }
}

// ===================================
// Initialize on DOM Load
// ===================================

let registry;
let ui;

document.addEventListener('DOMContentLoaded', () => {
    registry = new StudentRegistry();
    ui = new UIManager(registry);
    console.log('Student Registration System initialized');
});
