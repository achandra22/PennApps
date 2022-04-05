import cipher from 'node-forge/lib/cipher';

const forge = require('node-forge');
const passwordCheck = require('@marcusfernstrom/asva-password')

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

export const encrypt = (plaintext, encryptionKey, iv) => {
  const cipher = forge.cipher.createCipher('AES-CBC', encryptionKey);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(plaintext));
  cipher.finish();
  const encrypted = cipher.output;
  return encrypted;

};

export const decrypt = (ciphertext, decryptionKey, iv) => {
  const decipher = forge.cipher.createDecipher('AES-CBC', decryptionKey);
  decipher.start({iv: iv});
  decipher.update(forge.util.createBuffer(ciphertext));
  return decipher.output.toString().trim();

  // const decipher = forge.cipher.createDecipher('AES-CBC', decryptionKey);
  // decipher.start({iv: iv});
  // const length = ciphertext.length;
  // const chunkSize = 1024 * 64;
  // let index = 0;
  // let clear = '';
  // do {
  //   clear += decipher.output.getBytes();
  //   const buf = forge.util.createBuffer(ciphertext.substr(index, chunkSize));
  //   decipher.update(buf);
  //   index += chunkSize;
  // } while(index < length);
  // const result = decipher.finish();
  // assert(result);
  // clear += decipher.output.getBytes();
  // console.log(clear);
  // console.log(decipher.output.toString());
  // return decipher.output.toString().trim();
}

// export const decryptVault = (key, vault, salt) => {
//   const decryptedVault = {};
//   const decryptionKey = createMasterKey(key, salt);
//   Object.keys(vault).forEach(key => {
//     const username = vault[key].username;
//     const password = vault[key].password;
//     const iv = vault[key].iv;
//     const decryptedUsername = decrypt(username, decryptionKey, iv);
//     const decryptedPassword = decrypt(password, decryptionKey, iv);
//     decryptedVault[key] = {
//       username: decryptedUsername,
//       password: decryptedPassword,
//     };
//   });
//   return decryptedVault;
// }

// export const encryptVault = (encryptionKey, vault) => {
//   const encryptedVault = {};
//   // const encryptionKey = createMasterKey(key, salt);
//   Object.keys(vault).forEach(key => {
//     const plaintext = {
//       username: vault[key].username,
//       password: vault[key].password,
//     }
//     // const username = vault[key].username;
//     // const password = vault[key].password;
//     const iv = createSalt();
//     const encryptedKey = encrypt(key, encryptionKey, iv);
//     const encryptedData = encrypt(JSON.stringify(plaintext), encryptionKey, iv);

//     // const encryptedUsername = encrypt(username, encryptionKey, iv);
//     // const encryptedPassword = encrypt(password, encryptionKey, iv);
//     encryptedVault[encryptedKey] = {
//       data: encryptedData,
//       iv: iv
//     };
//   });
//   return encryptedVault;
// }

export const decryptVault = (key, vault, salt) => {
  const decryptedVault = {};
  const decryptionKey = createMasterKey(key, salt);
  Object.keys(vault).forEach(key => {
    const decryptedKey = decrypt(forge.util.hexToBytes(key), decryptionKey, salt);
    const data = decrypt(vault[key].data, decryptionKey, salt);
    decryptedVault[decryptedKey] = JSON.parse(data.substring(0, data.indexOf('}') + 1));
  });
  return decryptedVault;
}

export const encryptVault = (key, vault, salt) => {
  const encryptedVault = {};
  const encryptionKey = createMasterKey(key, salt);
  Object.keys(vault).forEach(key => {
    const plaintext = {
      username: vault[key].username,
      password: vault[key].password,
    }
    const encryptedKey = encrypt(key, encryptionKey, salt);
    const encryptedData = encrypt(JSON.stringify(plaintext), encryptionKey, salt);
    encryptedVault[forge.util.bytesToHex(encryptedKey)] = {data: encryptedData};
  });
  return encryptedVault;
}

export const hashValue = (value) => {
  const md = forge.md.sha256.create();
  md.update(value);
  return md.digest().toHex();
}

export const setStorage = (key, value) => {
  chrome.storage.sync.set({ [key]: value }, function () {
    console.log(key + ' is in storage');
  });
};

const secureRandomInt = (max) => {
  let num = 0;
  const min = 2 ** 32 % max; // for eliminating bias
  const rand = new Uint32Array(1);

  do {
    num = crypto.getRandomValues(rand)[0];
  } while (num < min);

  return num % max;
}

export const generatePassword = (length = 16) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!#$%&()*+,-./:;<=>?@[\\]^_`{|}~';
  const all = uppercase + lowercase + numbers + symbols;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = secureRandomInt(all.length)
    password += all[randomIndex];
  }
  return password;
}

export const validatePasswordStrength = (password) => {
  return passwordCheck(password);
}
