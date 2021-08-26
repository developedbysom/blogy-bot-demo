const { Base64 } = require("js-base64");
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

create_new_file = async function (octokit, file_name, new_data) {
  try {
    const blog_header_line1 =
      "|Title| Likes Count | Article Type | Posted On | Author Name | Status | #TAGS |";
    const blog_header_line2 =
      "|---------------|---------------|---------------|---------------|---------------|---------------|---------------|";

    const d = new Date();
    const cur_month = monthNames[d.getMonth()];
    const cur_year = d.getFullYear();

    let content =
      "# Important Blog Posts: " +
      cur_month +
      "-" +
      cur_year +
      "\n" +
      blog_header_line1 +
      "\n" +
      blog_header_line2 +
      "\n" +
      new_data;

    const contentEncoded = Base64.encode(content);
    await octokit.repos.createOrUpdateFileContents({
      owner: "developedbysom",
      repo: "blogy-bot-demo",
      path: file_name,
      message: "Created by Telegram Bot",
      content: contentEncoded,
      committer: {
        name: `telegram Bot`,
        email: "somnath.sap2020@gmail.com",
      },
      author: {
        name: "telegram Bot",
        email: "somnath.sap2020@gmail.com",
      },
    });

    const status = {
      file_create: "Successful",
    };

    return status;
  } catch (error) {
    const status = {
      file_create: "Failed",
    };

    return status;
  }
};
module.exports = create_new_file;
