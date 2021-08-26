get_filecontent = async function (octokit, file_name) {
  try {
    const file_content = await octokit.repos.getContent({
      owner: "developedbysom",
      repo: "blogy-bot-demo",
      path: file_name,
      mediaType: { format: "raw" },
    });

    return file_content;
  } catch (error) {
    if (error.status === 404) {
      console.log("File does not exists");
    }
  }
};

module.exports = get_filecontent;
