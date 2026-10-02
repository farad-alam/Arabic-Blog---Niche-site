fetch('https://www.motionbite.com')
  .then(res => res.text())
  .then(text => {
    const matches = text.match(/<meta[^>]+property=["']og:url["'][^>]*>/gi);
    console.log('Matches:', matches);
  });
