# Student Registration System

A modern, fully-responsive web application for managing student registrations. Built with vanilla HTML5, CSS3, and JavaScript—no dependencies required.

## 🎯 Features

### Core Functionality
- **Student Registration**: Comprehensive form with validation for personal, address, and academic information
- **Data Management**: Full CRUD operations (Create, Read, Update, Delete) for student records
- **Search & Filter**: Real-time search by name, email, or student ID
- **Sort Functionality**: Click column headers to sort by ID, name, major, year, or GPA
- **Statistics Dashboard**: View aggregate statistics including average GPA, highest GPA, and common major
- **Distribution Charts**: Visual bar charts showing major and year level distributions
- **Export Data**: Download all student records as CSV file
- **Persistent Storage**: All data saved to browser's localStorage

### User Experience
- **Responsive Design**: Optimized for mobile (320px), tablet (768px), and desktop (1024px+)
- **Accessible Interface**: WCAG 2.1 compliant with proper ARIA labels and keyboard navigation
- **Tab Interface**: Three main tabs for Registration, Student List, and Statistics
- **Modal Dialogs**: Inline edit form and confirmation dialogs for destructive actions
- **Mobile Navigation**: Hamburger menu for small screens
- **Form Validation**: Real-time validation with helpful error messages
- **Toast Notifications**: Success and error feedback messages
- **Smooth Animations**: CSS transitions for professional interactions

## 📋 Form Fields

### Personal Information
- Full Name (required)
- Email (required, validated)
- Phone Number (required, validated)
- Date of Birth (required, must be 16+)

### Address
- Street Address (required)
- City (required)
- State/Province (required)
- ZIP Code (required)
- Country (required)

### Academic Information
- Major (required, dropdown)
- Year Level (required, 1st-4th year)
- GPA (required, 0-4 scale)
- Enrollment Date (required)

## 🏗️ Project Structure

```
student-registration-system/
├── index.html      # Semantic HTML structure
├── style.css       # Professional responsive styling
├── script.js       # Complete application logic
└── README.md       # Documentation
```

## 🔧 Technical Details

### Architecture
- **MVC-inspired**: Separation of concerns with StudentRegistry, FormValidator, and UIManager classes
- **Event-driven**: Efficient event listeners with delegation
- **Functional**: Pure functions for data validation and transformation
- **Modular**: Well-organized classes with single responsibilities

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires JavaScript enabled
- Uses localStorage (available in all modern browsers)

### Performance
- Lightweight: Single HTML file, single CSS file, single JS file
- Optimized queries: Efficient sorting and searching algorithms
- Minimal DOM manipulation: Batch updates and event delegation

## 🚀 Getting Started

1. **Open in Browser**: Simply open `index.html` in any modern web browser
2. **Register Students**: Fill out the registration form with complete information
3. **View Dashboard**: Navigate to "Students" tab to see all registered students
4. **Manage Records**: Edit or delete individual student records
5. **View Statistics**: Check the "Statistics" tab for aggregate data
6. **Export Data**: Click "Export to CSV" to download records

## 📊 Data Storage

All student data is stored in the browser's `localStorage` under the key `students`. 

**Data Schema:**
```javascript
{
    id: 1000,                           // Auto-incremented ID
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    dob: "2005-03-15",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "United States",
    major: "Computer Science",
    year: "2nd Year",
    gpa: "3.85",
    enrollmentDate: "2024-01-15",
    registeredDate: "2024-02-15T10:30:00.000Z"
}
```

**Clear All Data**: Open browser DevTools console and run:
```javascript
localStorage.removeItem('students');
location.reload();
```

## ✅ Validation Rules

### Email
- Must be valid email format (user@domain.com)
- Required field

### Phone Number
- Must contain at least 10 digits
- Accepts formats: +1 (555) 123-4567, 555-123-4567, 5551234567
- Required field

### Date of Birth
- Applicant must be at least 16 years old
- Required field

### GPA
- Numeric value between 0.0 and 4.0
- Accepts decimals (e.g., 3.85)
- Required field

### All Text Fields
- Non-empty strings required
- Trimmed of whitespace

## 🎨 Customization

### Change Color Scheme
Edit CSS custom properties in `style.css`:
```css
:root {
    --color-primary: #3B82F6;        /* Change to your brand color */
    --color-secondary: #10B981;      /* Secondary accent */
    --color-danger: #EF4444;         /* Danger/delete actions */
    --color-light: #F3F4F6;          /* Light background */
    --color-dark: #1F2937;           /* Dark text */
}
```

### Modify Majors
Edit the major dropdown options in `index.html`:
```html
<select id="major" name="major" required>
    <option value="">Select a major</option>
    <option value="Your Major Here">Your Major Here</option>
</select>
```

### Adjust Year Levels
Edit the year dropdown options in `index.html`:
```html
<select id="year" name="year" required>
    <option value="">Select year level</option>
    <option value="Your Year">Your Year</option>
</select>
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px (single column, stacked layout)
- **Tablet**: 768px - 1023px (optimized for touch, wider layout)
- **Desktop**: 1024px+ (full multi-column layout)

## ♿ Accessibility Features

- **Semantic HTML**: Proper use of form elements, labels, and ARIA attributes
- **Keyboard Navigation**: All interactive elements accessible via Tab key
- **Focus Management**: Modal dialogs trap focus properly
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Error Messages**: Associated with form fields using aria-describedby
- **Screen Readers**: Proper role and state announcements

## 🔒 Data Privacy

- **No Server Calls**: All data stays in your browser
- **localStorage Only**: No external APIs or third-party services
- **Client-Side Processing**: All validation and sorting done locally
- **No Tracking**: No analytics or usage tracking

## 📝 Example Usage

### JavaScript API (Direct Access)

```javascript
// Initialize system
const registry = new StudentRegistry();
const ui = new UIManager(registry);

// Add a student programmatically
registry.addStudent({
    fullName: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    dob: "2004-06-20",
    address: "456 Oak Ave",
    city: "Somewhere",
    state: "NY",
    zip: "54321",
    country: "United States",
    major: "Business Administration",
    year: "3rd Year",
    gpa: "3.45",
    enrollmentDate: "2023-01-15"
});

// Search students
const results = registry.searchStudents("jane");

// Sort students
const sorted = registry.sortStudents("gpa", "desc");

// Get statistics
const allStudents = registry.getAllStudents();
console.log(`Total: ${allStudents.length}`);
```

## 🐛 Troubleshooting

### Data Not Saving
- **Check**: LocalStorage is enabled in browser
- **Solution**: Clear browser cache and try again
- **Alternative**: Check browser DevTools → Application → LocalStorage

### Form Not Submitting
- **Check**: All required fields are filled
- **Check**: Error messages displayed below form
- **Solution**: Scroll to top and review error messages

### Mobile Menu Not Working
- **Check**: JavaScript is enabled
- **Solution**: Hard refresh (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac)

### Data Lost After Browser Restart
- **Cause**: Private/Incognito mode doesn't preserve localStorage
- **Solution**: Use regular browsing mode for persistent storage

## 📞 Support

This is a standalone educational application with no external support. Refer to the source code in `script.js` for implementation details.

## 📄 License

Free to use and modify for personal and educational purposes.

## 🎓 Learning Resources

This project demonstrates:
- Object-oriented JavaScript (Classes)
- localStorage API for persistent data
- Form validation and error handling
- DOM manipulation and event handling
- Responsive CSS with custom properties
- Accessibility best practices
- CSV export functionality

---

**Created**: February 2024  
**Version**: 1.0.0  
**Status**: Production Ready
