const forge = require('node-forge');

export const createMasterKey = (password, salt) => {
  // A key of 32 bytes will use AES-256
  return forge.pkcs5.pbkdf2(password, salt, 100000, 32);
};

export const createMasterPasswordHash = (masterPassword, salt) => {
  const key = forge.pkcs5.pbkdf2(createMasterKey(salt, masterPassword), masterPassword, 1, 32);
  return key;
};

export const createSalt = () => {
  const salt = forge.random.getBytesSync(8);
  return salt;
};

export const createLoginHash = (masterPassword, username, salt) => {
  const masterKey = createMasterKey(masterPassword, username);
  return forge.pkcs5.pbkdf2(masterKey, salt, 100000, 32);
};

export const encrypt = (plaintext, masterPassword, salt) => {
  const cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({ iv: salt });
  cipher.update(forge.util.createBuffer(plaintext));
  cipher.finish();
  const encrypted = cipher.output;
  console.log(encrypted.toHex());
  return encrypted.toHex();
};

// export const getStorage = async (key) => {
//   let value = await new Promise(resolve => {
//       chrome.storage.sync.get([key], (object) => {
//           resolve(object);
//       });
//   })
//   return value;
// }

export const setStorage = (key, value) => {
  chrome.storage.sync.set({ [key]: value }, function () {
    console.log('Value is set to ' + value);
  });
};
