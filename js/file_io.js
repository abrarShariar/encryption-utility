const fs = require('fs');

const read_data = (path, opts = 'utf8') => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  });
}

const write_data = (path, data, opts = "utf8") => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, opts, (err) => {
      if (err) reject(err);
      console.log(`The file has been saved in ${path}`);
      resolve(true);
    })
  })
}

// append to file
const append_data = (path, data, opts = "utf8") => {
  return new Promise(() => {
    fs.appendFile('message.txt', 'data to append', (err) => {
      if (err) reject(err);
      console.log(`File appended at: ${path}`);
      resolve(true);
    });
  })
}

//convert byte array to hex string
const hexlify = (byteArray) => {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

module.exports = {
  read_data,
  write_data,
  hexlify
}
