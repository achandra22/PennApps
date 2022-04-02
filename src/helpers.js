const forge = require('node-forge');

export const createMasterKey = (payload, salt) => {
  // A key of 32 bytes will use AES-256
  return forge.pkcs5.pbkdf2(payload, salt, 100000, 32);
};

export const createMasterPasswordHash = (payload, salt) => {
  const key = forge.pkcs5.pbkdf2(createMasterKey(payload, salt), payload, 1, 32);
  return key;
};

export const createSalt = () => {
  return forge.random.getBytesSync(16);
};

export const createAuthHash = (masterPassword, username, salt) => {
  const masterKey = createMasterKey(masterPassword, username);
  const masterPasswordHash = forge.pkcs5.pbkdf2(masterKey, masterPassword, 1, 32);
  return forge.pkcs5.pbkdf2(masterPasswordHash, salt, 100000, 32);
};

export const encrypt = (plaintext, encryptionKey, salt) => {
  const cipher = forge.cipher.createCipher('AES-CBC', createMasterKey(encryptionKey, salt));
  cipher.start({ iv: salt });
  cipher.update(forge.util.createBuffer(plaintext));
  cipher.finish();
  const encrypted = cipher.output;
  console.log(encrypted.toHex());
  return encrypted;
};

export const decrypt = (ciphertext, decryptionKey, salt) => {
  console.log(ciphertext, decryptionKey, salt);
  const decipher = forge.cipher.createDecipher('AES-CBC', createMasterKey(decryptionKey, salt));
  decipher.start({iv: salt});
  decipher.update(forge.util.createBuffer(ciphertext));
  return decipher.output;
}

export const decryptVault = (encryptionKey, vault) => {
  const decryptedVault = {};
  Object.keys(vault).forEach(key => {
    const username = vault[key].username;
    const password = vault[key].password;
    const salt = vault[key].salt;
    const decryptedUsername = decrypt(username, encryptionKey, salt);
    const decryptedPassword = decrypt(password, encryptionKey, salt);
    decryptedVault[key] = {
      username: decryptedUsername,
      password: decryptedPassword,
    };
  });
  return decryptedVault;
}

export const encryptVault = (encryptionKey, vault) => {
  const encryptedVault = {};
  Object.keys(vault).forEach(key => {
    const username = vault[key].username;
    const password = vault[key].password;
    const salt = createSalt();
    const encryptedUsername = encrypt(username, encryptionKey, salt);
    const encryptedPassword = encrypt(password, encryptionKey, salt);
    encryptedVault[key] = {
      username: encryptedUsername,
      password: encryptedPassword,
      salt: salt
    };
  });
  return encryptedVault;
}

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
    console.log(key + ' is in storage');
  });
};
