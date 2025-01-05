const { contextBridge } = require("electron");
const encryption = require("./utils/encryption.js");

contextBridge.exposeInMainWorld("api", {
  encryption: {
    generatePseudoRandomKey: encryption.generatePseudoRandomKey,
    oneTimePadEncrypt: encryption.oneTimePadEncrypt,
    oneTimePadDecrypt: encryption.oneTimePadDecrypt,
    oneTimePadFileEncrypt: encryption.oneTimePadFileEncrypt,
    oneTimePadFileDecrypt: encryption.oneTimePadFileDecrypt,
    oneTimePadBlobDecrypt: encryption.oneTimePadBlobDecrypt,
    railFenceCipherEncrypt: encryption.railFenceCipherEncrypt,
    railFenceCipherDecrypt: encryption.railFenceCipherDecrypt,
    railFenceCipherFileEncrypt: encryption.railFenceCipherFileEncrypt,
    railFenceCipherFileDecrypt: encryption.railFenceCipherFileDecrypt,
    railFenceCipherBlobEncrypt: encryption.railFenceCipherBlobEncrypt,
  },
});
