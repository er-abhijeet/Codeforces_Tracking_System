import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import fetchData from "./utils/contestProgress.js";
import toPostgresInsertValues from "./utils/convertToQuery.js";
import axios from "axios";
import sendReminderEmail from "./utils/sendRemainderEmails.js";

dotenv.config();
// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;
import { getUnsolvedProblemsPerContest } from "./utils/cf_api.js";

// Middlewares
app.use(cors());
app.use(express.json());

// PostgreSQL connection using pg Pool (Neon-compatible)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Neon DB URL from .env
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.send("Server is running here");
});


async function sendInactivityReminders() {
  const client = await pool.connect();

  const res = await client.query(`
    SELECT s.handle, s.email, s.nickname, s.reminder_count
    FROM user_info s
    WHERE s.email_enabled = TRUE AND (
      NOT EXISTS (
        SELECT 1 FROM submissions sub
        WHERE sub.handle = s.handle AND sub.timestamp > NOW() - INTERVAL '7 days'
      )
    )
  `);

  for (const student of res.rows) {
    try {
      await sendReminderEmail(student.email, student.nickname);

      await client.query(`
        UPDATE user_info
        SET reminder_count = reminder_count + 1
        WHERE handle = $1
      `, [student.handle]);

      console.log(`📧 Reminder sent to ${student.handle}`);
    } catch (err) {
      console.error(`❌ Email failed for ${student.handle}:`, err.message);
    }
  }

  client.release();
}


const updateAll = async (handle) =>{
    let users=[];
    if(handle){
        users.push(handle);
    }else{
        let data=await fetch("http://localhost:3000/all");
        data=await data.json()
        data=data.users;
        users=data.map((e)=>e.cf_handle);
    }
    console.log(" Triggering scheduled Codeforces data sync for " ,users);
    // return;
    try{
        users.forEach(async (user) => {
            const resp=await fetch(`http://localhost:3000/addRatingHistory?user=${user}`);
            const resp1=await fetch(`http://localhost:3000/addNewUserContests?user=${user}`);
            const resp2=await fetch(`http://localhost:3000/addProblemData?user=${user}`);
            const res9=await pool.query(
            `INSERT INTO last_updated (handle, updated_at)
            VALUES ($1, NOW())
            ON CONFLICT (handle)
            DO UPDATE SET updated_at = EXCLUDED.updated_at`,
            [user]
            );
        });
        console.log("Triggered all operations"); 
    }catch(err){console.log("error while triggering ",err)} 
    finally{return "done"}
}

app.get("/last-updated", async (req, res) => {
  const  handle  = req.query.user;
  try {
    const result = await pool.query(
      "SELECT updated_at FROM last_updated WHERE handle = $1",
      [handle]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No update history found" });
    }

    res.json({ updated_at: result.rows[0].updated_at });
  } catch (err) {
    console.error("Failed to fetch last updated:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/all", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * from user_info`);
    res.status(201).json({ message: "User fetched", users: result.rows });
  } catch (err) {
    console.error("Error getting user:", err.message);
    res.status(500).json({ error: "Failed get users" });
  }
});

// POST /adduser - add a user to the database
app.post("/adduser", async (req, res) => {
  const {
    name,
    email,
    avatar,
    currentRating,
    handle,
    maxRating,
    nickname,
    ph_no,
  } = req.body;
  console.log(req.body);

  if (!email || !handle || !name) {
    return res
      .status(400)
      .json({ error: "Name, email, and handle are required." });
  }

  try {
    // 1. Check if handle already exists
    const checkHandle = await pool.query(
      "SELECT * FROM user_info WHERE cf_handle = $1",
      [handle]
    );

    if (checkHandle.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "User with this handle already exists." }); 
    }

    // 2. Insert new user
    const result = await pool.query(
      `INSERT INTO user_info 
      (cf_name, email, avatar, current_rating, cf_handle, max_rating, nickname, ph_no)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (cf_handle) DO NOTHING RETURNING *`,
      [name, email, avatar, currentRating, handle, maxRating, nickname, ph_no]
    );
    updateAll(handle);
    
    res.status(201).json({ message: "User added", user: result.rows[0] });
  } catch (err) {
    console.error("Error adding user:", err.message);
    res.status(500).json({ error: "Failed to add user" });
  }
});
 
app.get("/addRatingHistory", async (req, res) => {
  try {
    // console.log(req.query.user);
    const data = await fetchData(req.query.user);
    const valuesSQL = toPostgresInsertValues(data, req.query.user);
    // console.log(`INSERT INTO codeforces_rating_history (
    // contest_id, contest_name, rating_update_time, old_rating, new_rating, handle
    // ) VALUES \n${valuesSQL} ON CONFLICT (contest_id, handle) DO NOTHING;`);
    const results = await pool.query(
      `INSERT INTO codeforces_rating_history (
  contest_id, contest_name, rating_update_time, old_rating, new_rating, handle
) VALUES \n${valuesSQL} ON CONFLICT (contest_id, handle) DO NOTHING;`
    );
    res.json(results);
  } catch (err) {
    res.send("error is der", err);
  }
});

app.get("/addNewUserContests", async (req, res) => {
  try {
    const data = await getUnsolvedProblemsPerContest(req.query.user);
    const handle = req.query.user;
    const valuesSql = data
      .map(
        (c) =>
          `('${handle}', ${c.contestId}, '${c.contestName.replace(
            /'/g,
            "''"
          )}', ${c.totalProblems}, ${c.solvedProblems}, ${
            c.unsolvedProblems
          }, ${c.oldRating}, ${c.newRating}, ${c.rank}, '${c.participatedAt}')`
      )
      .join(",\n");
    // console.log("fd", valuesSql);
    const insertSql = `
                INSERT INTO contest_data (
                handle, contestId, contestName, totalProblems, solvedProblems,
                unsolvedProblems, oldRating, newRating, rank, participatedAt
                )
                VALUES
                ${valuesSql}
                ON CONFLICT (handle,contestId) DO NOTHING;
                `;
    const res1 = await pool.query(insertSql);
    res.send("done");
  } catch (err) {
    res.status(403).json(err);
  }
});

app.get("/progressData", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT contest_id, contest_name, EXTRACT(EPOCH FROM rating_update_time) AS rating_update_time_seconds,
             old_rating, new_rating
      FROM codeforces_rating_history
      WHERE handle='${req.query.user}'
      ORDER BY rating_update_time ASC
    `);
    const formatted = result.rows.map((row) => ({
      contestId: row.contest_id,
      contestName: row.contest_name,
      ratingUpdateTimeSeconds: Math.floor(row.rating_update_time_seconds),
      oldRating: row.old_rating,
      newRating: row.new_rating,
    }));

    res.json({ result: formatted });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error while getting history" + err });
  }
});

app.get("/recentContestData", async (req, res) => {
  try {
    const handle = req.query.user;
    // console.log(handle);
    const res1 = await pool.query(
      `
    SELECT
      contestId,
      contestName,
      totalProblems,
      solvedProblems,
      unsolvedProblems,
      oldRating,
      newRating,
      rank,
      participatedAt
    FROM contest_data
    WHERE handle = $1
    ORDER BY participatedAt ASC;
  `,
      [handle]
    );
    // console.log(res1.rows);
    const data = res1.rows.map((row) => ({
      contestId: row.contestid,
      contestName: row.contestname,
      totalProblems: row.totalproblems,
      solvedProblems: row.solvedproblems,
      unsolvedProblems: row.unsolvedproblems,
      oldRating: row.oldrating,
      newRating: row.newrating,
      rank: row.rank,
      participatedAt: row.participatedat,
    }));
    // console.log("data is ",data);
    res.json(data);
  } catch (err) {
    res.json("error is there",err);
  }
  // const data = await getUnsolvedProblemsPerContest(req.query.user);
  // console.log(data);
  // res.json(data);
});

app.get("/addProblemData", async (req, res) => {
  const  handle  = req.query.user;
  try {
    const { data } = await axios.get(
      `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
    );

    const submissions = data.result.filter(sub => sub.verdict === "OK");
    for (const sub of submissions) {
      const {
        contestId,
        problem: { index, name, rating },
        programmingLanguage,
        creationTimeSeconds,
      } = sub;

      await pool.query(
        `INSERT INTO submissions 
        ( handle, contest_id, problem_index, problem_name, problem_rating, programming_language, verdict, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, 'OK', to_timestamp($7))
        ON CONFLICT (handle, contest_id, problem_index) DO NOTHING`,
        [
          handle,
          contestId,
          index,
          name,
          rating || null,
          programmingLanguage,
          creationTimeSeconds,
        ]
      );
    }
    res.json({ message: "Submissions stored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch/store submissions" });
  }
});

app.get("/stats/:handle", async (req, res) => {
  const { handle } = req.params;
  try {
    const client = await pool.connect();

    // 1. Total solved
    const total = await client.query(
      `SELECT COUNT(*) FROM submissions WHERE handle = $1`,
      [handle]
    );

    // 2. Average rating
    const avgRating = await client.query(
      `SELECT AVG(problem_rating) FROM submissions WHERE handle = $1 AND problem_rating IS NOT NULL`,
      [handle]
    );

    // 3. Most difficult problem
    const hardest = await client.query(
      `SELECT problem_name, problem_rating, contest_id, problem_index
       FROM submissions 
       WHERE handle = $1 AND problem_rating IS NOT NULL 
       ORDER BY problem_rating DESC LIMIT 1`, 
      [handle]
    );

    // 4. Submissions per rating bucket
    const buckets = await client.query(
      `SELECT FLOOR(problem_rating / 100) * 100 AS bucket, COUNT(*) 
       FROM submissions 
       WHERE handle = $1 AND problem_rating IS NOT NULL 
       GROUP BY bucket ORDER BY bucket`,
      [handle]
    );

    // 5. Avg problems per day
    const range = await client.query(
      `SELECT MIN(timestamp) as min_date, MAX(timestamp) as max_date
       FROM submissions WHERE handle = $1`,
      [handle]
    );

    const date1 = range.rows[0].min_date;
    const date2 = range.rows[0].max_date;
    const days = Math.max(1, (new Date(date2) - new Date(date1)) / (1000 * 3600 * 24));
    const avgPerDay = Number(total.rows[0].count) / days;

    // 6. Heatmap data
    const heatmap = await client.query(
      `SELECT DATE(timestamp) as date, COUNT(*) as count 
       FROM submissions WHERE handle = $1 
       GROUP BY date ORDER BY date`,
      [handle]
    );

    res.json({
      totalSolved: Number(total.rows[0].count),
      averageRating: parseFloat(avgRating.rows[0].avg).toFixed(2),
      hardestProblem: hardest.rows[0],
      problemsPerDay: avgPerDay.toFixed(2),
      ratingBuckets: buckets.rows.map(r => ({ rating: r.bucket, count: Number(r.count) })),
      heatmapData: heatmap.rows.map(r => ({ date: r.date, count: Number(r.count) })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute stats" });
  }
});


app.delete("/deleteuser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM user_info WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(405).json({ error: "User not found." });
    }

    res.json({ message: "User deleted successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


app.get("/email-status/:handle", async (req, res) => {
  const { handle } = req.params;
  const result = await pool.query("SELECT reminder_count, email_enabled FROM user_info WHERE cf_handle = $1", [handle]);

  if (result.rowCount === 0)
    return res.status(404).json({ error: "Student not found" });

  res.json(result.rows[0]);
});

app.post("/email-toggle/:handle", async (req, res) => {
  const { handle } = req.params;
  const { enabled } = req.body;

  await pool.query("UPDATE user_info SET email_enabled = $1 WHERE cf_handle = $2", [enabled, handle]);
  res.json({ message: `Email reminders ${enabled ? "enabled" : "disabled"} for ${handle}` });
});


import cron from "node-cron";
// Run at 2:00 AM daily
// cron.schedule("0 2 * * *", async () => {
//     const ans=await updateAll();
// });

let currentTask = null;

function scheduleCronJob(cronExpression) {
  if (currentTask) currentTask.stop();

  currentTask = cron.schedule(cronExpression, async () => {
    console.log("⏰ Cron job triggered at", new Date().toLocaleString());
    // Call your /fetch-and-store logic here
    const ans=await updateAll();
    await sendInactivityReminders();  
  });

  currentTask.start();
  console.log("✅ Scheduled cron with expression:", cronExpression);
}

function generateCronExpression(hour, minute, frequency) {
  switch (frequency) {
    case "hourly":
      return `${minute} * * * *`;
    case "weekly":
      return `${minute} ${hour} * * 0`; // Sunday
    case "daily":
    default:
      return `${minute} ${hour} * * *`;
  }
}

// Initial default cron at 6:30 PM daily
scheduleCronJob("0 2 * * *");

app.post("/update-cron", (req, res) => {
  const { hour, minute, frequency } = req.body;

  if (
    isNaN(parseInt(hour)) || isNaN(parseInt(minute)) ||
    parseInt(hour) < 0 || parseInt(hour) > 23 ||
    parseInt(minute) < 0 || parseInt(minute) > 59
  ) {
    return res.status(400).json({ message: "Invalid time values" });
  }

  const cronExp = generateCronExpression(hour, minute, frequency);
  scheduleCronJob(cronExp);
  res.json({ message: `Cron updated to run ${frequency} at ${hour}:${minute}` });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
