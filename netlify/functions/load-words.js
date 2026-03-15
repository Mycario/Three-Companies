exports.handler = async () => {
  const token = process.env.GITHUB_TOKEN;
  const user  = 'Mycario';
  const repo  = 'Three-Companies';
  const path  = 'pages/custom_words.json';

  try {
    const res = await fetch(
      `https://api.github.com/repos/${user}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (res.status === 404) {
      return {
        statusCode: 200,
        body: JSON.stringify({ words: [], sha: null })
      };
    }

    const data = await res.json();
    const decoded = JSON.parse(atob(data.content.replace(/\n/g, '')));

    return {
      statusCode: 200,
      body: JSON.stringify({ words: decoded, sha: data.sha })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};