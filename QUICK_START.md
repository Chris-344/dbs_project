# Borrowing System - Quick Start Guide

## 🚀 Getting Started

### 1. Database Setup (One-time)
Run the migration scripts from `DATABASE_MIGRATION.md`:
- Add `COPIES_AVAILABLE` to PUBLICATIONS
- Create BORROWING table
- Create procedures and functions
- Set initial copy counts

### 2. Start the Backend
```bash
cd backend
npm install  # if needed
npm start
# Runs on http://localhost:5000
```

### 3. Start the Frontend
```bash
cd frontend
npm install  # if needed
npm run dev
# Runs on http://localhost:5173 (or similar)
```

### 4. Navigate to Search & Borrow
Visit `/search-author` route or click "Search & Borrow" in navbar.

---

## 📚 Using the System

### Searching for Books

1. **Enter Publication Title**
   - Type full or partial title (e.g., "Database", "Systems")
   - Case-insensitive search

2. **Click "Search"**
   - Results show: ID, Title, Year, Source, Available Copies

3. **View Availability**
   - Green "Details" button = Book available
   - Grayed "Unavailable" = No copies available

### Borrowing a Book

1. **Click "Details"** on any available book
   - Shows copy information
   - Displays borrowing form

2. **Fill Borrowing Form**
   - **Borrower Name**: Your name (required)
   - **Issue Date**: Today's date or start date
   - **Return Date**: When you'll return it

3. **Click "Borrow Book"**
   - Success message appears
   - Availability count decreases
   - Borrowing history updates

### Checking History

- **Borrowing History Table** at bottom
- Shows last 5 transactions
- Columns: Borrower, Issue Date, Return Date, Status
- Status: "Active" (not returned) or "Returned"

---

## 💡 Key Concepts

### Availability Logic
```
Available Now = Total Copies - Active Borrows

Active Borrow = Record where:
  ✓ Not yet returned (RETURNED = 0)
  ✓ Return date hasn't passed yet (RETURN_DATE >= TODAY)
```

**Examples:**
- 3 copies, 1 borrowed = 2 available ✅
- 1 copy, 1 borrowed (overdue) = 0 available ❌
- 2 copies, 2 borrowed = 0 available ❌

### Date Rules
- **Issue Date**: Usually today
- **Return Date**: Future date (14-30 days)
- Format: YYYY-MM-DD (e.g., 2024-12-25)

---

## 🎨 UI Features

### Search Results Table
| Column | Purpose |
|--------|---------|
| ID | Publication identifier |
| Title | Book/publication name |
| Year | Publication year |
| Source | Journal/venue |
| Available | Copies available now |
| Action | Details or Unavailable |

### Availability Info Card
Displays when book is selected:
- ✅ **Total Copies**: How many exist
- 📊 **Currently Borrowed**: Active borrows
- 🟢 **Available Now**: Can borrow? (highlighted)

### Borrowing Form
Only appears when copies available:
- Borrower Name (text input)
- Issue Date (date picker)
- Return Date (date picker)
- Submit button with success feedback

---

## ⚙️ Backend API Reference

### Search Publications
```bash
GET /api/searchPublicationByTitle?title=Database
```

**Response:**
```json
[
  [1, "Advanced Database Systems", 2023, "ACM Conference", 2],
  [3, "Learning Databases", 2024, "Tutorial", 1]
]
```

### Check Availability
```bash
GET /api/checkAvailability/1
```

**Response:**
```json
{
  "pub_id": 1,
  "title": "Advanced Database Systems",
  "copiesAvailable": 2,
  "activeBorrows": 1,
  "availableNow": 1,
  "canBorrow": true
}
```

### Borrow Publication
```bash
POST /api/borrowPublication
Content-Type: application/json

{
  "pub_id": 1,
  "borrower_name": "John Doe",
  "issue_date": "2024-12-20",
  "return_date": "2025-01-03"
}
```

**Response:**
```json
{
  "message": "Publication borrowed successfully",
  "available": 0
}
```

### Borrowing History
```bash
GET /api/borrowingHistory/1
```

**Response:**
```json
[
  [1, "John Doe", "2024-12-20", "2025-01-03", 0],
  [2, "Jane Smith", "2024-12-18", "2024-12-25", 1]
]
```

---

## ❌ Common Issues & Solutions

### Issue: "Book not available for borrowing"
- **Cause**: No copies available
- **Fix**: Wait for someone to return a copy or check availability

### Issue: Search returns no results
- **Cause**: Title doesn't match or publication not added
- **Fix**: Try different keywords or add publication first

### Issue: "Details" button is grayed out
- **Cause**: Book has 0 copies available
- **Fix**: Check history to see when copies might be returned

### Issue: Dates won't save in form
- **Cause**: Invalid date format or return date in past
- **Fix**: Use YYYY-MM-DD format, ensure return date > issue date

---

## 📝 Example Workflow

```
1. Search: "Advanced"
   └─ Results: 2 publications

2. Found: "Advanced Database Systems"
   └─ Available: 1 copy

3. Click Details
   └─ Info: 2 total, 1 borrowed, 1 available

4. Fill Form:
   - Name: "Alice Johnson"
   - Issue: 2024-12-20
   - Return: 2025-01-03

5. Click "Borrow Book"
   └─ Success! Available: 0 copies

6. History Updated:
   - Alice Johnson: 2024-12-20 to 2025-01-03 (Active)
```

---

## 🔒 Data Consistency

The system ensures:
- ✅ Can't borrow more than available copies
- ✅ Availability auto-updates
- ✅ History accurately tracked
- ✅ No orphaned records
- ✅ Date validation

---

## 📊 Database Verification

Check system health:

```sql
-- Count total borrows
SELECT COUNT(*) as total_borrowings FROM BORROWING;

-- See active borrows
SELECT PUB_ID, BORROWER_NAME, ISSUE_DATE, RETURN_DATE 
FROM BORROWING 
WHERE RETURNED = 0;

-- Check availability for all books
SELECT PUB_ID, TITLE, COPIES_AVAILABLE, 
       (SELECT COUNT(*) FROM BORROWING 
        WHERE PUB_ID = PUBLICATIONS.PUB_ID 
        AND RETURNED = 0 AND RETURN_DATE >= SYSDATE) as active
FROM PUBLICATIONS;
```

---

## 🎯 Next Steps

1. ✅ Run database migrations
2. ✅ Start backend and frontend
3. ✅ Add publications with copy counts
4. ✅ Search and borrow books
5. ✅ Check availability and history

---

## 📞 Support

For issues:
1. Check error messages in browser console
2. Verify database connection
3. Review `BORROWING_SYSTEM.md` for detailed docs
4. Check `DATABASE_MIGRATION.md` for setup issues
