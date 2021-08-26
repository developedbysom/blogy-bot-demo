is_fileExists = async function (octokit, file_name) {
  try {
    const file_content = await octokit.repos.getContent({
      owner: "developedbysom",
      repo: "blogy-bot-demo",
      path: file_name,
    });

    const content = {
      file_exists: true,
      sha: file_content.data.sha,
    };
    return content;
  } catch (error) {
    const content = {
      file_exists: false,
      sha: "",
    };
    return content;
  }
};
module.exports = is_fileExists;
