/**
 * Student Registration System - JavaScript
 * Vanilla JS, no dependencies
 * Includes: Authentication, Student Management, Form Validation
 */

// ===================================
// Authentication System
// ===================================

class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
    }

    getCurrentUser() {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error('Error getting current user:', e);
            return null;
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    register(name, email, password) {
        // Validate input
        if (!name.trim() || !email.trim() || !password) {
            return { success: false, error: 'Please fill in all fields' };
        }

        if (password.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters' };
        }

        // Check if email already exists
        const users = this.getAllUsers();
        if (users.some(u => u.email === email)) {
            return { success: false, error: 'Email already registered' };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'Please enter a valid email' };
        }

        // Create new user (store password - note: in production, always hash passwords!)
        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // WARNING: Never store plain text passwords in production!
            createdAt: new Date().toISOString()
        };

        const users = this.getAllUsers();
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        return { success: true, user: newUser };
    }

    login(email, password) {
        if (!email.trim() || !password) {
            return { success: false, error: 'Please enter email and password' };
        }

        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: false, error: 'Email not found' };
        }

        if (user.password !== password) {
            return { success: false, error: 'Incorrect password' };
        }

        // Successful login
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(userSession));
        this.currentUser = userSession;

        return { success: true, user: userSession };
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    getAllUsers() {
        try {
            const users = localStorage.getItem('users');
            return users ? JSON.parse(users) : [];
        } catch (e) {
            console.error('Error getting users:', e);
            return [];
        }
    }
}

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

// ===================================
// Authentication UI Manager
// ===================================

class AuthUIManager {
    constructor(authManager) {
        this.auth = authManager;
        this.setupEventListeners();
        this.checkAuthentication();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Signup form
        const signupForm = document.getElementById('signupForm');
        signupForm.addEventListener('submit', (e) => this.handleSignup(e));

        // Toggle forms
        document.getElementById('toSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleForms();
        });

        document.getElementById('toLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleForms();
        });

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    checkAuthentication() {
        if (this.auth.isAuthenticated()) {
            this.showMainApp();
        } else {
            this.showAuthPage();
        }
    }

    handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Clear previous errors
        document.getElementById('loginEmailError').textContent = '';
        document.getElementById('loginPasswordError').textContent = '';
        document.getElementById('loginMessage').className = 'form-message';

        const result = this.auth.login(email, password);

        if (result.success) {
            document.getElementById('loginMessage').className = 'form-message success';
            document.getElementById('loginMessage').textContent = 'Login successful! Redirecting...';
            
            setTimeout(() => {
                document.getElementById('loginForm').reset();
                this.showMainApp();
            }, 500);
        } else {
            document.getElementById('loginMessage').className = 'form-message error';
            document.getElementById('loginMessage').textContent = result.error;
        }
    }

    handleSignup(e) {
        e.preventDefault();

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;

        // Clear previous errors
        document.getElementById('signupNameError').textContent = '';
        document.getElementById('signupEmailError').textContent = '';
        document.getElementById('signupPasswordError').textContent = '';
        document.getElementById('signupConfirmError').textContent = '';
        document.getElementById('signupMessage').className = 'form-message';

        // Validate match
        if (password !== confirm) {
            document.getElementById('signupConfirmError').textContent = 'Passwords do not match';
            return;
        }

        const result = this.auth.register(name, email, password);

        if (result.success) {
            document.getElementById('signupMessage').className = 'form-message success';
            document.getElementById('signupMessage').textContent = 'Account created successfully! You can now login.';
            
            setTimeout(() => {
                document.getElementById('signupForm').reset();
                this.toggleForms();
            }, 1000);
        } else {
            document.getElementById('signupMessage').className = 'form-message error';
            document.getElementById('signupMessage').textContent = result.error;
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to sign out?')) {
            this.auth.logout();
            this.showAuthPage();
            document.getElementById('loginForm').reset();
            document.getElementById('signupForm').reset();
            document.getElementById('loginForm').classList.add('active');
            document.getElementById('signupForm').classList.remove('active');
        }
    }

    toggleForms() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        loginForm.classList.toggle('active');
        signupForm.classList.toggle('active');

        // Clear messages when toggling
        document.getElementById('loginMessage').className = 'form-message';
        document.getElementById('signupMessage').className = 'form-message';
    }

    showAuthPage() {
        document.getElementById('authContainer').style.display = 'flex';
        document.getElementById('navbar').style.display = 'none';
        document.getElementById('main-content').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('navbar').style.display = 'block';
        document.getElementById('main-content').style.display = 'block';

        // Update user display
        if (this.auth.currentUser) {
            document.getElementById('userDisplay').textContent = `Welcome, ${this.auth.currentUser.name}`;
        }
    }
}

let auth;
let authUI;
let registry;
let ui;

document.addEventListener('DOMContentLoaded', () => {
    auth = new AuthManager();
    authUI = new AuthUIManager(auth);
    
    // Initialize main app only if authenticated
    if (auth.isAuthenticated()) {
        registry = new StudentRegistry();
        ui = new UIManager(registry);
        console.log('Student Registration System initialized - User authenticated');
    } else {
        console.log('Authentication required');
    }
});
