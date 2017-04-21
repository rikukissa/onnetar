const cors = require('cors')({origin: true});
const google = require('googleapis');
const functions = require('firebase-functions');

const urlshortener = google.urlshortener({
  version: 'v1',
  auth: functions.config().shortener.key,
});

exports.shorten = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const params = {
      resource: {
        longUrl: request.query.url,
      },
    };

    urlshortener.url.insert(params, function(err, res) {
      if (err) {
        response.status(500).send(err);
        return;
      }
      response.status(200).send({
        url: res.id,
      });
    });
  });
});
