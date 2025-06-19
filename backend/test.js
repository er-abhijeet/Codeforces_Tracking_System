console.log(" Triggering scheduled Codeforces data sync...");
try {
  const users=['er.abhijeet']
  users.forEach(async (user) => {
    const resp = await fetch(`http://localhost:3000/addRatingHistory?user=${user}`);
    const resp1 = await fetch(`http://localhost:3000/addNewUserContests?user=${user}`);
    const resp2 = await fetch(`http://localhost:3000/addProblemData?user=${user}`);
  });
  console.log("Triggered all operations");
} catch (err) { console.log("error while triggering ", err) }