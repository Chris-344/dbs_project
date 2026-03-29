# Library Management System - Borrowing Extension

## Overview
The system has been extended with borrowing functionality while maintaining all existing features. The "Search Author" feature now includes book borrowing capabilities.

## Architecture

### Database Changes
Added three new database components:

1. **PUBLICATIONS Table Enhancement**
   - Added `COPIES_AVAILABLE` column (default: 1)
   - Tracks total copies of each publication

2. **BORROWING Table (New)**
   - `BORROW_ID`: Unique identifier for each borrow record
   - `PUB_ID`: Foreign key to PUBLICATIONS
   - `BORROWER_NAME`: Name of the person borrowing
   - `ISSUE_DATE`: Date when book was issued
   - `RETURN_DATE`: Expected return date
   - `RETURNED`: Flag indicating if book has been returned (0/1)
   - `CREATED_AT`: Timestamp of borrow record creation

3. **New Database Objects**
   - `BORROW_PUBLICATION()`: Procedure to record new borrowing
   - `GET_PUBLICATION_AVAILABILITY()`: Function to check current availability
   - Indexes on PUB_ID and RETURN_DATE for performance

### Backend API Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|-----------|
| `/api/searchPublicationByTitle` | GET | Search publications by title | `title` (query param) |
| `/api/borrowPublication` | POST | Record a new borrowing | `pub_id`, `borrower_name`, `issue_date`, `return_date` |
| `/api/checkAvailability/:pubId` | GET | Check book availability | `pubId` (url param) |
| `/api/borrowingHistory/:pubId` | GET | Get borrowing history for a book | `pubId` (url param) |

### Frontend Changes

#### New Component: BorrowBook.tsx
Located at `frontend/src/pages/BorrowBook.tsx`

**Features:**
- Search publications by title
- View real-time availability
- Borrow books with issue/return dates
- View borrowing history
- Success notifications

**States Managed:**
- `searchType`: Type of search (publication)
- `searchResults`: Publications matching search
- `selectedPub`: Currently selected publication
- `availability`: Availability info for selected pub
- `borrowerName`, `issueDate`, `returnDate`: Borrowing form data
- `borrowingHistory`: Recent transactions

---

## Business Logic

### Availability Calculation
```
Available Copies = COPIES_AVAILABLE - Active Borrows
```

**Where:**
- `COPIES_AVAILABLE` = Total copies in system
- `Active Borrows` = Borrow records where:
  - `RETURNED = 0` (not yet returned)
  - `RETURN_DATE >= TODAY` (return date hasn't passed)

### Borrowing Flow
1. User searches for publication by title
2. System displays all matching publications with copy count
3. User clicks "Details" to check availability
4. If `Available Copies > 0`, borrowing form is shown
5. User fills borrower name, issue date, return date
6. System records borrow transaction
7. Availability count decreases
8. Borrowing history is updated

### Smart Availability
- Books with overdue return dates automatically become available again
- System checks real-time availability before allowing borrow
- Prevents borrowing when `Available Copies == 0`

---

## Navigation
The "Search & Borrow" route (`/search-author`) replaces the previous "Search Author" page while maintaining backward compatibility with the URL.

**Nav Links:**
- Authors (Home)
- Add Author
- Add Publication
- **Search & Borrow** (renamed from "Search Author")

---

## Data Entry Format

### Dates
- Format: `YYYY-MM-DD` (e.g., 2024-12-25)
- Use HTML5 date input for easy selection

### Borrower Name
- Simple text input
- No character restrictions

### Publication Search
- Partial title matches supported (case-insensitive LIKE query)
- Searches against PUBLICATIONS.TITLE

---

## UI/UX Features

### Visual Components
- **Availability Badge**: Color-coded status (green=available, red=unavailable)
- **Copy Status**: Shows total, borrowed, and available copies
- **Borrowing Form**: Only appears when book is available
- **History Table**: Displays recent transactions for selected book
- **Success Message**: Confirmation when book is borrowed

### Dark Mode Support
- All components fully styled for dark mode
- Proper color contrast maintained
- Glassmorphism effects on cards

---

## Constraints & Limitations

1. **Lightweight Implementation**
   - No user authentication
   - No borrowing penalties/overdue fees
   - No reservation system
   - Single borrower per transaction

2. **Database Requirements**
   - Oracle Database with support for:
     - Identity columns (AUTO_INCREMENT equivalent)
     - Functions and Procedures
     - Date functions (TRUNC, SYSDATE)

3. **Minimal Database Changes**
   - Only 3 new columns/tables
   - Backward compatible with existing schema
   - No data migration required

---

## Testing the System

### Steps:
1. Add publications with `COPIES_AVAILABLE` value > 1
2. Search for publication by title
3. Click "Details" on result
4. Fill borrower name and dates
5. Click "Borrow Book"
6. Check availability decreases
7. Borrow same book again (if copies > 1)

### Expected Behavior:
- ✅ Available books show "Details" button
- ✅ Unavailable books show "Unavailable" (disabled)
- ✅ Borrowing form appears only for available books
- ✅ History updates after successful borrow
- ✅ Copy count decreases with each borrow

---

## Future Enhancements (Not Implemented)

- Book return functionality
- Overdue tracking and penalties
- Reservation system
- User accounts and borrowing limits
- Search history tracking
- Email notifications
- Late fees calculation

---

## File Structure

```
frontend/src/
├── pages/
│   ├── BorrowBook.tsx        (NEW - Borrowing interface)
│   ├── Search.tsx            (Original author search)
│   ├── AddAuthor.tsx
│   ├── AddPublication.tsx
│   └── DisplayData.tsx
├── App.tsx                   (Updated with BorrowBook route)
└── App.css                   (Extended with borrowing styles)

backend/
└── server.js                 (Added borrowing endpoints)

database/
└── main.sql                  (Extended schema)
```

---

## Summary

✅ **Preserved Existing Functionality**
- Authors management unchanged
- Publications management unchanged
- Original search functionality accessible

✅ **Added Borrowing Capability**
- Minimal database changes
- Smart availability checking
- Seamless UI integration

✅ **Lightweight Implementation**
- No overengineering
- Reuses existing table structure
- Simple, readable logic
