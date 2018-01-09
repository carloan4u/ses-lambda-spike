import shortHash from 'shorthash';

export default (fromEmail, toEmail) => {
  var timestamp = Math.round((new Date()).getTime() / 1000);
  return hashString(`${fromEmail}${toEmail}${timestamp}`);
}

function hashString(str) {
  return shortHash.unique(str);
}