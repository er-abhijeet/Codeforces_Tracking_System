const base_url = `https://codeforces.com/api/user.rating?handle=`

export default async function fetchData(handle) {
    try {
        const response = await fetch(base_url + handle);
        const data = await response.json();
        console.log(data);
        let contest = (data.result).map((con) => {
            let ob = { contestId: con.contestId, contestName: con.contestName, ratingUpdateTimeSeconds: con.ratingUpdateTimeSeconds, oldRating: con.oldRating, newRating: con.newRating };
            return ob;
        });
        return contest;
    } catch (err) {
        console.log("error while fetching progress ", err)
    }
}