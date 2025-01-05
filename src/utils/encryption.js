const os = require("os");
const crypto = require("crypto");

const oneTimePadBlobDecrypt = (blob, blobName, key) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const encryptedArrayBuffer = new Uint8Array(reader.result);

      // Expand the key to match the length of the encrypted file
      while (key.length < encryptedArrayBuffer.length) {
        key = expandKey(key, encryptedArrayBuffer.length);
      }

      // Decrypt the file byte by byte using the one-time pad
      const decryptedBytes = new Uint8Array(encryptedArrayBuffer.length);
      for (let i = 0; i < encryptedArrayBuffer.length; i++) {
        decryptedBytes[i] = encryptedArrayBuffer[i] ^ key[i];
      }

      const decryptedBlob = new Blob([decryptedBytes], {
        type: "application/octet-stream",
      });

      resolve([blobName, decryptedBlob]);
    };

    reader.onerror = () => {
      console.error("Error reading encrypted file");
      reject(new Error("File read failed"));
    };

    reader.readAsArrayBuffer(blob);
  });
};

const railFenceCipherBlobEncrypt = (fileBlob, fileName, key) => {
  if (!fileBlob) {
    console.error("No file Blob provided");
    return;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = new Uint8Array(reader.result);
      const encryptedBuffer = applyRailFenceCipherToBuffer(
        arrayBuffer,
        key,
        true
      );

      const encryptedBlob = new Blob([encryptedBuffer], {
        type: "application/octet-stream",
      });

      resolve([fileName, encryptedBlob]);
    };

    reader.onerror = () => {
      console.error("Error reading Blob");
      reject(new Error("Blob read failed"));
    };

    reader.readAsArrayBuffer(fileBlob);
  });
};

const railFenceCipherFileEncrypt = (fileInput, key) => {
  const file = fileInput.files[0];
  if (!file) {
    console.error("No file selected");
    return;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = new Uint8Array(reader.result);
      const encryptedBuffer = applyRailFenceCipherToBuffer(
        arrayBuffer,
        key,
        true
      );

      const encryptedBlob = new Blob([encryptedBuffer], {
        type: "application/octet-stream",
      });
      const encryptedFileName = `${file.name}.encrypted`;

      resolve([encryptedFileName, encryptedBlob]);
    };

    reader.onerror = () => {
      console.error("Error reading file");
      reject(new Error("File read failed"));
    };

    reader.readAsArrayBuffer(file);
  });
};

const railFenceCipherFileDecrypt = (fileInput, key) => {
  const file = fileInput.files[0];
  if (!file) {
    console.error("No file selected");
    return;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = new Uint8Array(reader.result);
      const decryptedBuffer = applyRailFenceCipherToBuffer(
        arrayBuffer,
        key,
        false
      );

      const decryptedBlob = new Blob([decryptedBuffer], {
        type: "application/octet-stream",
      });
      const decryptedFileName = file.name.endsWith(".encrypted")
        ? file.name.slice(0, -10)
        : file.name;

      resolve([decryptedFileName, decryptedBlob]);
    };

    reader.onerror = () => {
      console.error("Error reading file");
      reject(new Error("File read failed"));
    };

    reader.readAsArrayBuffer(file);
  });
};

const railFenceCipherEncrypt = (plainText, key) => {
  let rail = Array.from({ length: key }, () =>
    Array(plainText.length).fill("")
  );

  let down = false;
  let row = 0,
    col = 0;

  for (let i = 0; i < plainText.length; i++) {
    // Reverse the direction when we hit the top or bottom of the rail
    if (row == 0 || row == key - 1) down = !down;

    rail[row][col++] = plainText[i];

    down ? row++ : row--;
  }

  let encryptedText = "";
  for (let i = 0; i < key; i++) {
    for (let j = 0; j < plainText.length; j++) {
      if (rail[i][j] != "") encryptedText += rail[i][j];
    }
  }

  return encryptedText;
};

const railFenceCipherDecrypt = (cipherText, key) => {
  let rail = Array.from({ length: key }, () =>
    Array(cipherText.length).fill("")
  );

  let down = false;
  let row = 0,
    col = 0;

  // Mark the path of the rail
  for (let i = 0; i < cipherText.length; i++) {
    if (row === 0 || row === key - 1) down = !down;

    rail[row][col++] = "*";
    down ? row++ : row--;
  }

  // Fill the rail
  let index = 0;
  for (let i = 0; i < key; i++) {
    for (let j = 0; j < cipherText.length; j++) {
      if (rail[i][j] === "*" && index < cipherText.length) {
        rail[i][j] = cipherText[index++];
      }
    }
  }

  // Read the rail and fill the plain text
  let plainText = "";
  row = 0;
  col = 0;
  down = false;

  for (let i = 0; i < cipherText.length; i++) {
    if (row === 0 || row === key - 1) down = !down;

    plainText += rail[row][col++];
    down ? row++ : row--;
  }

  return plainText;
};

const applyRailFenceCipherToBuffer = (buffer, key, encrypt) => {
  const length = buffer.length;
  const result = new Uint8Array(length);

  if (encrypt) {
    // Apply Rail Fence Cipher Encryption
    let idx = 0;
    for (let i = 0; i < key; i++) {
      let step = 2 * (key - 1);
      for (let j = i; j < length; j += step) {
        result[idx++] = buffer[j];
        if (i > 0 && i < key - 1 && j + step - 2 * i < length) {
          result[idx++] = buffer[j + step - 2 * i];
        }
      }
    }
  } else {
    // Apply Rail Fence Cipher Decryption
    const positions = new Array(length).fill(0);
    let idx = 0;
    for (let i = 0; i < key; i++) {
      let step = 2 * (key - 1);
      for (let j = i; j < length; j += step) {
        positions[idx++] = j;
        if (i > 0 && i < key - 1 && j + step - 2 * i < length) {
          positions[idx++] = j + step - 2 * i;
        }
      }
    }
    positions.forEach((pos, i) => {
      result[pos] = buffer[i];
    });
  }

  return result;
};

const oneTimePadDecrypt = (encryptedText, key) => {
  // Convert the encrypted message from Base64 to bytes
  const encryptedBytes = Buffer.from(encryptedText, "base64");
  const keyBytes = Buffer.from(key, "utf-8");

  // Expand the key to match the encrypted message length
  const expandedKey = expandKey(keyBytes, encryptedBytes.length);

  // Perform XOR decryption
  const decryptedBytes = Buffer.alloc(encryptedBytes.length);
  for (let i = 0; i < encryptedBytes.length; i++) {
    decryptedBytes[i] = encryptedBytes[i] ^ expandedKey[i];
  }

  // Convert the decrypted bytes back to a UTF-8 string
  return decryptedBytes.toString("utf-8");
};

const oneTimePadEncrypt = (message, key) => {
  // Convert message and key to UTF-8 bytes
  const messageBytes = Buffer.from(message, "utf-8");
  const keyBytes = Buffer.from(key, "utf-8");

  // Expand the key to match the message length
  const expandedKey = expandKey(keyBytes, messageBytes.length);

  // Perform XOR encryption
  const encryptedBytes = Buffer.alloc(messageBytes.length);
  for (let i = 0; i < messageBytes.length; i++) {
    encryptedBytes[i] = messageBytes[i] ^ expandedKey[i];
  }

  return encryptedBytes.toString("base64");
};

const oneTimePadFileEncrypt = (fileInput, key) => {
  const file = fileInput.files[0];
  if (!file) {
    console.error("No file selected");
    return;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const encryptedBytes = new Uint8Array(uint8Array.length);

      // Expand the key if necessary
      while (key.length < uint8Array.length) {
        key = expandKey(key, uint8Array.length);
      }

      // Encrypt the file byte by byte using the Buffer
      for (let i = 0; i < uint8Array.length; i++) {
        encryptedBytes[i] = uint8Array[i] ^ key[i];
      }

      const encryptedFile = new Blob([encryptedBytes], {
        type: "application/octet-stream",
      });

      const encryptedFileName = `${file.name}.encrypted`;

      resolve([encryptedFileName, encryptedFile]);
    };

    reader.onerror = () => {
      console.error("Error reading file");
      reject(new Error("File read failed"));
    };

    reader.readAsArrayBuffer(file);
  });
};

const oneTimePadFileDecrypt = (fileInput, key) => {
  const file = fileInput.files[0];
  if (!file) {
    console.error("No file selected");
    return;
  }

  const fileName = file.name.endsWith(".encrypted")
    ? file.name.slice(0, -10)
    : file.name;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const decryptedBytes = new Uint8Array(uint8Array.length);

      // Expand the key if necessary
      while (key.length < uint8Array.length) {
        key = expandKey(key, uint8Array.length);
      }

      // Decrypt the file byte by byte using the Buffer
      for (let i = 0; i < uint8Array.length; i++) {
        decryptedBytes[i] = uint8Array[i] ^ key[i];
      }

      const decryptedFile = new Blob([decryptedBytes], {
        type: "application/octet-stream",
      });

      resolve([fileName, decryptedFile]);
    };

    reader.onerror = () => {
      console.error("Error reading file");
      reject(new Error("File read failed"));
    };

    reader.readAsArrayBuffer(file);
  });
};

// Generate a pseudo random key using the current date, process ID, hostname, uptime, CPU model, memory, MAC address,
// CPU serial number, free memory, memory usage, load average, precise time, and random bytes. Shuffle the factors and combine them into a string
const generatePseudoRandomKey = () => {
  const factorsArray = [];

  factorsArray.push(Date.now());
  factorsArray.push(process.pid);
  factorsArray.push(os.hostname());
  factorsArray.push(os.uptime());
  factorsArray.push(os.cpus()[0].model);
  factorsArray.push(os.totalmem());

  const networkInterfaces = os.networkInterfaces();
  const macAddress = Object.values(networkInterfaces)
    .flat()
    .find((iface) => iface.mac && iface.mac !== "00:00:00:00:00:00")?.mac;
  factorsArray.push(macAddress);

  factorsArray.push(os.cpus()[0]?.serialNumber || "Unknown");
  factorsArray.push(os.freemem());
  factorsArray.push(process.memoryUsage());
  factorsArray.push(os.loadavg());
  factorsArray.push(performance.now());

  const randomBytes = crypto.randomBytes(8).toString("hex");
  factorsArray.push(randomBytes);

  shuffleArray(factorsArray);
  const combinedFactors = factorsArray.join("|");

  const pseudoRandomKey = crypto
    .createHash("sha256")
    .update(combinedFactors)
    .digest("hex");
  return pseudoRandomKey;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const expandKey = (key, outputBytesLength) => {
  let newKey = Buffer.from(key);

  while (newKey.length < outputBytesLength) {
    const hash = crypto.createHash("sha256").update(newKey).digest();
    newKey = Buffer.concat([newKey, hash]);
  }

  return newKey.slice(0, outputBytesLength);
};

module.exports = {
  oneTimePadEncrypt,
  oneTimePadDecrypt,
  generatePseudoRandomKey,
  oneTimePadFileEncrypt,
  oneTimePadFileDecrypt,
  oneTimePadBlobDecrypt,
  railFenceCipherEncrypt,
  railFenceCipherDecrypt,
  railFenceCipherFileEncrypt,
  railFenceCipherFileDecrypt,
  railFenceCipherBlobEncrypt,
};
