const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 4500;
const myName = 'Rustam';

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => res.render('index', { name: myName }));


app.post('/captcha', async (req, res) => {

  // Data received from a form with recaptcha
  console.log('REQ.BODY: \n', req.body);
  console.log('REQ.CONNECTION.REMOTEADDRESS: \n', req.connection.remoteAddress);

  // const captcha = req.body['g-recaptcha-response'];    // If data comes-in from form submit
  const captcha = req.body.captcha;                    // If data comes-in from fetch
  console.log('captcha: \n', captcha);
  if(!captcha) {
    return res.json({ success: false, message: "Please select captcha" });
  }

  // Secret Key
  const secretKey = "6LcM8tYZAAAAAGlfF4sLptdM6TeK55IgyJK3DqSe";

  // Verify URL (Constcruct a request for google recaptcha api)
  const verifyUrl = "https://www.google.com/recaptcha/api/siteverify?secret="
     + secretKey 
     //  + "&response=" + req.body['g-recaptcha-response']       // If data comes-in from form submit
     + "&response=" + req.body.captcha                         // If data comes-in from fetch
     + "&remoteip=" + req.connection.remoteAddress;

     console.log('VERIFY URL: ', verifyUrl);

  // Make Request to VerifyURL (Send to google and await verification response)
  const body = await fetch(verifyUrl).then(res => res.json());
  // Response
  console.log('Response from google: \n', body);
  /* {
      success: true,
      challenge_ts: '2020-10-21T15:27:33Z',
      hostname: 'localhost'
    } */

  // If not successful
  if(body.success !== undefined && !body.success) {
    return res.json({ success: false, message: "Failed captca verification" });
  }
  // If Successful
  if(body.success === true) {
    return res.json({ success: true, message: "Captcha passed" });
  }
  // Otherwise
  return res.json({ success: false, message: "Captca verification unavailable" });

});

// Listener
app.listen(port, () => console.log(`Server is running on port: ${port}`));