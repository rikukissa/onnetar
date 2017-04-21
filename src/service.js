import axios from 'axios';

export function shorten(url) {
  return axios
    .get('https://us-central1-onnetar-5474d.cloudfunctions.net/shorten', {
      params: {
        url,
      },
    })
    .then(res => res.data);
}
