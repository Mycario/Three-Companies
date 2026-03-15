exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const token = process.env.GITHUB_TOKEN;
  const user  = 'Mycario';
  const repo  = 'Three-Companies';
  const path  = 'pages/custom_words.json';

  try {
    const { action, words, sha } = JSON.parse(event.body);

    const body = {
      message: action === 'delete' ? 'Remove word from Vaellish lexicon' : 'Update Vaellish lexicon',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(words, null, 2)))),
      ...(sha ? { sha } : {})
    };

    const res = await fetch(
      `https://api.github.com/repos/${user}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return { statusCode: res.status, body: JSON.stringify({ error: err.message }) };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ sha: data.content.sha })
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};