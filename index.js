const express = require("express");
const app = express();
const { json } = require("express");
const PORT = process.env.PORT || 3000;
app.use(json());
app.use(express.urlencoded({ extended: false }));

require("dotenv").config();
const { Octokit } = require("@octokit/rest");

const is_fileExists = require("./modules/if_fileExists");
const get_filecontent = require("./modules/get_filecontent");
const create_new_file = require("./modules/create_new_file");

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function cleanString(input) {
  var output = "";
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127) {
      output += input.charAt(i);
    }
  }
  return output;
}

const get_file_name = () => {
  const d = new Date();
  const cur_month = d.getMonth() + 1;
  const cur_year = d.getFullYear();
  const file_name =
    cur_month +
    "_Blog_Posts_" +
    monthNames[d.getMonth()] +
    "_" +
    cur_year +
    ".md";
  return file_name;
};

const main = async (new_data) => {
  const file_name = get_file_name();
  const { file_exists, sha } = await is_fileExists(octokit, file_name);

  if (file_exists) {
    const { data } = await get_filecontent(octokit, file_name);
    if (!data.includes(new_data)) {
      const { file_update } = await update_filecontent(
        octokit,
        file_name,
        data,
        new_data,
        sha
      );
      return `File update status: ${file_update}`;
    } else {
      return `File update status: Blog Post already updated`;
    }
  } else {
    const { file_create } = await create_new_file(octokit, file_name, new_data);
    return `File Creation status: ${file_create}`;
  }
};

app.post("/blog-post", (req, res) => {
  var spawn = require("child_process").spawn;
  // console.log(req.body.url);
  var process = spawn("python", [
    "./url-crawler.py",
    req.body.url, // passed url
  ]);

  process.stdout.on("data", async function (data) {
    data_utf8 = cleanString(data.toString());
    const status = await main((new_data = data_utf8));

    res.send({
      replies: [
        {
          type: "text",
          content: status.toString(),
        },
      ],
      conversation: {
        memory: { key: "value" },
      },
    });
  });

  process.stderr.on("data", function (data) {
    res.send({
      replies: [
        {
          type: "text",
          content: "Error Occured!! Please recheck SAP blog-post URL",
        },
      ],
      conversation: {
        memory: { key: "value" },
      },
    });
  });
});

app.listen(PORT, console.log(`Listening on port ${PORT}`));
