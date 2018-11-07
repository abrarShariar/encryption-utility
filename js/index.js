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
  key = util.encodeBase64(key);
  let keyBuffer = Buffer.from(key, 'base64');

  const nonceBuff = crypto.randomBytes(24);
  const nonce64 = nonceBuff.toString('base64');

  const messageBuff = Buffer.from(data);

  let box = nacl.secretbox(messageBuff, nonceBuff, keyBuffer);

  const encrypted_data = util.encodeBase64(box);
  return { encrypted_data, key, nonce64 };
}

const encrypt_json_data = (json_data) => {
  const { encrypted_data, key, nonce64 } = encrypt_data(json_data);
  return { encrypted_data, key, nonce64 };
}

const decrypt_data = (box, key, nonce64) => {
  let keyBuffer = Buffer.from(key, 'base64');
  let boxBuffer = Buffer.from(box, 'base64');
  let nonceBuffer = Buffer.from(nonce64, 'base64');

  try {
    // let box_new = nacl.secretbox(boxBuffer, nonceBuff, keyBuffer);
    const result = nacl.secretbox.open(boxBuffer, nonceBuffer, keyBuffer);
    return util.encodeUTF8(result);
  } catch (e) {
    console.log("Error in decrypt_data: ", e);
    return false;
  }
}


const encrypt_file = async (filepath, sKey) => {
  const data = await FileIO.read_data(filepath);
  const key = crypto.createHash('sha256').update(sKey).digest();
  const nonceBuff = crypto.randomBytes(24);
  const nonce64 = nonceBuff.toString('base64');
  const messageBuff = Buffer.from(data);

  const box = nacl.secretbox(messageBuff, nonceBuff, key);
  const encrypted_data = Buffer.from(box).toString('hex');
  const encrypted_file_path = compute_sha256_hash(encrypted_data) + '.enc';

  FileIO.write_data(encrypted_file_path, encrypted_data);
  return { encrypted_file_path, data: compute_sha256_hash(data), encrypted_data: compute_sha256_hash(encrypted_data), nonce64 };
}


const decrypt_file = async (filePath, skey, nonce64) => {
  const encrypted_data = await FileIO.read_data(filepath);
  const key = crypto.createHash('sha256').update(skey).digest();
  const nonceBuffer = Buffer.from(nonce64, 'base64');

  try {
    const box = nacl.secretbox.open(encrypted_data, nonceBuffer, keyBuffer);
    const decrypted_data = Buffer.from(box).toString('hex');
    return { decrypted_data, compute_sha256_hash(decrypted_data), compute_sha256_hash(encrypted_data) };
  } catch (e) {
    console.log("Error in decrypt_file", e);
    return false;
  }
}

// encrypt_file('file.txt', '123');

// let data = "Python";
// const { encrypted_data, key, nonce64 } = encrypt_data(data);
// //
// // console.log(encrypted_data);
// const decrypted_data = decrypt_data(encrypted_data, key, nonce64);
//
// console.log(decrypted_data);
// console.log((encrypted_data));
// console.log((key));
// const new_data = util.encodeUTF8(encrypted_data);
// console.log(new_data);

// console.log((key));
// console.log(util.encodeUTF8(encrypted_data));
// console.log(util.encodeUTF8(key));

// let json_data = "{'name': 'Abrar', 'age': 999}";
//
// const {encrypted_data, key} = encrypt_json_data(json_data);
// console.log(encrypted_data);
// console.log(key);

// let data = "Hello Python";
// compute_sha256_hash_file('file.txt')
//       .then(result => console.log(result))
