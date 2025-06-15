import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";

const makeCommits = (dates) => {
  if (dates.length === 0) {
    simpleGit().push((err) => {
      if (err) {
        console.error("Error on push:", err);
      } else {
        console.log("All commits pushed successfully.");
      }
    });
    return;
  }

  const [currentDate, ...remainingDates] = dates;
  const formattedDate = currentDate.format();

  const data = {
    date: formattedDate,
  };

  jsonfile.writeFile(path, data, (err) => {
    if (err) {
      console.error(`Error writing file for date ${formattedDate}:`, err);
      // Skip this date and move to the next
      makeCommits(remainingDates);
      return;
    }

    simpleGit()
      .add([path])
      .commit(formattedDate, { "--date": formattedDate }, (err) => {
        if (err) {
          console.error(`Error committing for date ${formattedDate}:`, err);
        } else {
          console.log(`Committed for ${formattedDate}`);
        }
        // Whether commit succeeded or failed, move to the next date
        makeCommits(remainingDates);
      });
  });
};

// Generate 127 consecutive days starting from February 1st, 2025
const startDate = moment("2025-02-01");
const dates = [];
for (let i = 0; i < 127; i++) {
  dates.push(startDate.clone().add(i, "days"));
}

// Shuffle the array of dates to make commit order random
for (let i = dates.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [dates[i], dates[j]] = [dates[j], dates[i]];
}

// Start the commit process
console.log("Starting to make 127 commits...");
makeCommits(dates);