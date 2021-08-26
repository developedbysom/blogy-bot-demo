const { Base64 } = require("js-base64");
update_filecontent = async function (octokit, file_name, data, new_data, sha) {
  try {
    let content = data + new_data;
    const contentEncoded = Base64.encode(content);

    await octokit.repos.createOrUpdateFileContents({
      owner: "developedbysom",
      repo: "blogy-bot-demo",
      path: file_name,
      sha: sha,
      message: "File updated by telegram bot",
      content: contentEncoded,
      committer: {
        name: `Telegram Bot`,
        email: "somnath.sap2020@gmail.com",
      },
      author: {
        name: "Telegram Bot",
        email: "somnath.sap2020@gmail.com",
      },
    });

    const status = {
      file_update: "Successful",
    };

    return status;
  } catch (error) {
    const status = {
      file_update: "Failed",
    };
    return status;
  }
};

module.exports = update_filecontent;
