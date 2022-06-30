import { async } from 'regenerator-runtime';
import { timeoutSec } from './config.js';
//to stop loading for ever..we can create timeout..this func returns a new promise..which rejects after few seconds
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//has func that are frequently used in project..we've saved url in config..we can save the func to get or fetch url here as it is used frequently
export const getJSON = async function (url) {
  try {
    //it is a business logic that takes main part of app.so goes into model
    //both fetch and timeout returns promises..if fetch is executed 1st..then it is returned..else if timeout is returned 1st..it is executed..so we use a race cond. here
    //timeoutsec is imported from config
    //    const fetchPro = [fetch(url), timeout(timeoutSec)];
    //  const res = await Promise.race(fetchPro);
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} status : ${res.status}`);
    }
    return data;
  } catch (err) {
    throw err;
    //we dont want to catch our func in helper..we want it in our file where we called it..model.js or anyother..so we throw the error again
  }
};
