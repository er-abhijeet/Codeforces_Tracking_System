# Codeforces Tracker - Student Codeforces Progress Tracker

Codeforces Tracker is a full-stack web application designed to track and analyze students' Codeforces performance. It fetches and stores Codeforces data for registered users, generates analytics, and provides automated reminders for inactivity. It features a React-based frontend and a Node.js + PostgreSQL backend.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
  - [Student Management](#student-management)
  - [Codeforces Sync and Stats](#codeforces-sync-and-stats)
  - [Reminders and Inactivity Tracking](#reminders-and-inactivity-tracking)
- [Frontend Components](#frontend-components)
- [Cron Job Management](#cron-job-management)
- [Email Reminder System](#email-reminder-system)
- [Validation](#validation)
- [Charts and Visuals](#charts-and-visuals)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## 📦 Features

- 🔍 View and search all registered students with ratings and activity
- 📈 Detailed profile view showing:
  - Rating chart (Codeforces rating over time)
  - Problem-solving stats (count, rating avg, hardest problem)
  - Submission heatmap
  - Rating-wise problem histogram
- 🔔 Automatically detect inactive students and email them reminders
- 📬 Track and control how many reminders were sent per student
- 📆 Schedule cron jobs to sync Codeforces data automatically
- 🕒 View and customize cron schedule (UI + backend support)
- 🧾 Admin interface to enable/disable emails per student
- 🛠️ Modular, scalable architecture

---

## 🛠️ Tech Stack

| Layer       | Technology              |
|-------------|--------------------------|
| Frontend    | React + Tailwind CSS     |
| Backend     | Node.js + Express        |
| Database    | PostgreSQL               |
| Sync        | node-cron + Codeforces API |
| Email       | Nodemailer (Gmail SMTP)  |

---

## 🗄️ Database Schema

### students
```sql
CREATE TABLE students (
  handle TEXT PRIMARY KEY,
  nickname TEXT,
  email TEXT,
  ph_no TEXT,
  email_enabled BOOLEAN DEFAULT TRUE,
  reminder_count INTEGER DEFAULT 0
);
```

### codeforces_rating_history
```sql
CREATE TABLE codeforces_rating_history (
  contest_id INT,
  handle TEXT,
  contest_name TEXT,
  rating_update_time TIMESTAMP,
  old_rating INT,
  new_rating INT,
  PRIMARY KEY (contest_id, handle)
);
```

### submissions
```sql
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  handle TEXT,
  timestamp TIMESTAMP,
  rating INT,
  problem_name TEXT,
  problem_index TEXT,
  verdict TEXT
);
```

### last_updated
```sql
CREATE TABLE last_updated (
  handle TEXT PRIMARY KEY,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📡 API Documentation

### GET `/stats/:handle`
Returns complete statistical data for a student.
#### Response:
```json
{
  "totalSolved": 48,
  "averageRating": 1350,
  "problemsPerDay": 2.1,
  "hardestProblem": {
    "problem_name": "Awesome Problem",
    "problem_rating": 1900,
    "contest_id": 1234,
    "problem_index": "C"
  },
  "ratingBuckets": {
    "800": 2,
    "900": 5,
    "1000": 6
  }
}
```

### GET `/last-updated/:handle`
Returns the timestamp of last data sync for a student.
```json
{ "updated_at": "2025-06-18T18:30:00.000Z" }
```

### POST `/update-cron`
Update cron schedule.
```json
{
  "hour": "18",
  "minute": "30",
  "frequency": "daily"
}
```

### GET `/email-status/:handle`
Get reminder count and email status.
```json
{
  "reminder_count": 3,
  "email_enabled": true
}
```

### POST `/email-toggle/:handle`
Enable/disable email reminders.
```json
{ "enabled": false }
```

---

## 🔁 Cron Job Management

- Scheduled via `node-cron`
- Calls CF API to sync data
- Updates `submissions`, `rating_history`, `last_updated`
- Identifies inactive users (>7 days)
- Sends reminder emails and updates `reminder_count`

---

## 📬 Email Reminder System

- Email sent via Nodemailer (Gmail SMTP)
- Triggered after sync
- Sends only if no submission in past 7 days
- Skipped if `email_enabled = false`

---

## ✅ Validation

### Frontend
- Required fields enforced (handle, email, nickname)
- Real-time input validation

### Backend
- `ON CONFLICT DO NOTHING` to avoid duplicates
- Input format and type checks
- Constraint handling (e.g., `PRIMARY KEY`, `FOREIGN KEY`)

---

## 📊 Charts and Visuals

- **Line Chart**: Rating over time
- **Bar Chart**: Problem count by rating bucket
- **Heatmap**: Submissions per day

---

## ⚛️ Frontend Components

### `StudentTable.jsx`
- Table listing all students
- Includes view/edit/delete buttons
- Shows handle, nickname, phone, email, ratings

### `StudentProfile.jsx`
- Rating history line graph
- 2x2 grid stats: Total Solved, Avg Rating, Hardest Problem, Problems/Day
- Heatmap and bar chart visualization

### `CronScheduler.jsx`
- Inputs to select hour, minute, frequency
- Button to save cron settings via API

### `EmailReminderSettings.jsx`
- Displays current reminder count
- Toggle button to enable/disable reminders

### `AddStudentModal.jsx`
- Modal form to input new student
- Disable save unless all fields are filled

---

## 🧪 Future Enhancements

- Weekly/monthly leaderboard
- Streak tracking and badges
- Dashboard for mentors
- Progress trend analysis per topic/tag
- Support for multiple platforms (AtCoder, LeetCode)

---

## 📜 License

MIT License — open to use, modify, and distribute with attribution.
