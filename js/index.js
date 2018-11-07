const nacl = require("tweetnacl"); // cryptographic functions
const util = require("tweetnacl-util"); // encoding & decoding
const crypto = require('crypto');
const FileIO = require('./file_io');

const textEncoding = require('text-encoding');
const TextDecoder = textEncoding.TextDecoder;

const compute_sha256_hash = (data) => {
  const encrpted_data = '';
  return crypto.createHash('sha256').update(encrpted_data).digest('hex');
}

const compute_sha256_hash_file = async (filePath) => {
  const fileData = await FileIO.read_data(filePath);
  return compute_sha256_hash(fileData);
}

const encrypt_data = (data) => {
  let key = nacl.randomBytes(nacl.secretbox.keyLength);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const msgParamsUInt8Array = util.decodeUTF8(data);
  let encrypted_data = nacl.secretbox(msgParamsUInt8Array, nonce, key);

  key = new TextDecoder("utf-8").decode(key);
  encrypted_data = new TextDecoder("utf-8").decode(encrypted_data);

  return { encrypted_data, key };
}


let data = "Python";
const { encrypted_data, key } = encrypt_data(data);

console.log(typeof(encrypted_data));
console.log(typeof(key));

console.log((encrypted_data));
console.log((key));
// const new_data = util.encodeUTF8(encrypted_data);
// console.log(new_data);

// console.log((key));
// console.log(util.encodeUTF8(encrypted_data));
// console.log(util.encodeUTF8(key));



// let data = "Hello Python";
// compute_sha256_hash_file('file.txt')
//       .then(result => console.log(result))
