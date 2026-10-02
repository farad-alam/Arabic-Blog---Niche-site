fetch('https://motionbite.com/opengraph-image?1b9e8afc1382bb9c')
  .then(res => {
     console.log('Status:', res.status, res.headers.get('content-type'));
  });
