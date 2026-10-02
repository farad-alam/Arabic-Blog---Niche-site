fetch('https://motionbite.com')
  .then(res => res.text())
  .then(text => {
    const matches = text.match(/<meta[^>]+property=["']og:image["'][^>]*>/gi);
    console.log('Matches:', matches);
  });
