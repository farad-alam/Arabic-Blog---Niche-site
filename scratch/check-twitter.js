fetch('https://www.motionbite.com')
  .then(res => res.text())
  .then(text => {
    const matches = text.match(/<meta[^>]+property=["']twitter:image["'][^>]*>|<meta[^>]+name=["']twitter:image["'][^>]*>/gi);
    console.log('Matches:', matches);
  });
