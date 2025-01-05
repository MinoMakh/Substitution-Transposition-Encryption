const {
  generatePseudoRandomKey,
  oneTimePadEncrypt,
  oneTimePadDecrypt,
  oneTimePadFileEncrypt,
  oneTimePadBlobDecrypt,
  railFenceCipherEncrypt,
  railFenceCipherDecrypt,
  railFenceCipherFileDecrypt,
  railFenceCipherBlobEncrypt,
} = window.api.encryption;

// Toast
const toastText = document.querySelector(".toast-body");
const toast = new bootstrap.Toast(document.querySelector(".toast"));

// Loader
const loader = document.getElementById("loader");

//  Encryption DOM Elements
// prettier-ignore
const encryptButton = document.getElementById("encrypt-button"),
    encryptInput = document.getElementById("encrypt-input"),
    encryptFile = document.getElementById("encrypt-file"),
    encryptOutputContainer = document.getElementById("encrypt-output-container"),
    encryptOutput = document.getElementById("encrypt-output"),
    encryptOutputTextContainer = document.getElementById("encrypt-output-text-container"),
    encryptOutputFileContainer = document.getElementById("encrypt-output-file-container"),
    cipherEncryptFileInput = document.getElementById("cipher-file-name"),
    downloadEncryptCipherFileButton = document.getElementById("download-cipher-file-button"),
    copyKeyButton = document.getElementById("copy-key-button"),
    cipherCopyButton = document.getElementById("copy-cipher-button"),
    encryptKeyInput = document.getElementById("encrypt-key-input");

//  Decryption DOM Elements
// prettier-ignore
const decryptButton = document.getElementById("decrypt-button"),
    decryptInput = document.getElementById("decrypt-input"),
    decryptFile = document.getElementById("decrypt-file"),
    decryptOutputContainer = document.getElementById("decrypt-output-container"),
    decryptOutput = document.getElementById("decrypt-output"),
    decryptOutputTextContainer = document.getElementById("decrypt-output-text-container"),
    plainFileInput = document.getElementById("plain-file-name"),
    downloadPlainFileButton = document.getElementById("download-plain-file-button"),
    decryptOutputFileContainer = document.getElementById("decrypt-output-file-container"),
    plainCopyButton = document.getElementById("copy-plain-button"),
    decryptOtpKeyInput = document.getElementById("decrypt-otp-key-input"),
    decryptRfcKeyInput = document.getElementById("decrypt-rfc-key-input");

encryptButton.onclick = () => handleEncryption();

decryptButton.onclick = () => handleDecryption();

const handleEncryption = () => {
  // If no file and text is entered, display toast
  if (!encryptFile.files.length && encryptInput.value === "") {
    displayToast("Please enter a text or file to encrypt.");
    return;
  }

  if (encryptKeyInput.value === "") {
    displayToast("Please enter a key to encrypt.");
    return;
  }

  showLoader();

  encryptOutputContainer.classList.remove("hidden");

  const otpKey = generatePseudoRandomKey();
  const rfcKey = encryptKeyInput.value;

  copyKeyButton.onclick = () =>
    copyToClipboard({ value: otpKey }, "Key copied to clipboard.");

  try {
    // Encrypt text if available
    if (encryptInput.value !== "") {
      const encryptedText1 = oneTimePadEncrypt(encryptInput.value, otpKey);
      const encryptedText2 = railFenceCipherEncrypt(encryptedText1, rfcKey);

      encryptOutput.textContent = encryptedText2;
      encryptOutputTextContainer.classList.remove("hidden");

      cipherCopyButton.onclick = () =>
        copyToClipboard(encryptOutput, "Cipher text copied to clipboard.");
    }

    // Encrypt file if available
    if (encryptFile.files.length) {
      oneTimePadFileEncrypt(encryptFile, otpKey)
        .then(([fileName, encryptedFile1]) =>
          railFenceCipherBlobEncrypt(encryptedFile1, fileName, rfcKey)
        )
        .then(([fileName, encryptedFile2]) => {
          cipherEncryptFileInput.value = fileName;

          downloadEncryptCipherFileButton.onclick = () => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(encryptedFile2);
            link.download = fileName;
            link.click();
          };

          encryptOutputFileContainer.classList.remove("hidden");
        })
        .catch((error) => {
          console.error("File encryption failed:", error);
          displayToast("An error occurred during file encryption.");
        })
        .finally(() => {
          hideLoader();
          displayToast("Inputs successfully encrypted.");
        });
    } else {
      hideLoader();
      displayToast("Inputs successfully encrypted.");
    }
  } catch (error) {
    console.error("Encryption failed:", error);
    displayToast("Encryption failed.");
    hideLoader();
  }
};

const handleDecryption = () => {
  // If no file and text is entered, display toast
  if (!decryptFile.files.length && decryptInput.value === "") {
    displayToast("Please enter a text or file to decrypt.");
    return;
  }

  const otpKey = decryptOtpKeyInput.value;
  const rfcKey = decryptRfcKeyInput.value;

  // If no key is entered, display toast
  if (otpKey === "" || rfcKey === "") {
    displayToast("Please enter a key to decrypt.");
    return;
  }

  showLoader();

  decryptOutputContainer.classList.remove("hidden");

  try {
    // Decrypt text if available
    if (decryptInput.value !== "") {
      const decryptedText1 = railFenceCipherDecrypt(decryptInput.value, rfcKey);
      const decryptedText2 = oneTimePadDecrypt(decryptedText1, otpKey);

      decryptOutput.textContent = decryptedText2;
      decryptOutputTextContainer.classList.remove("hidden");

      plainCopyButton.onclick = () =>
        copyToClipboard(decryptOutput, "Plain text copied to clipboard.");
    }

    // Decrypt file if available
    if (decryptFile.files.length) {
      railFenceCipherFileDecrypt(decryptFile, rfcKey)
        .then(([decryptedFileName, decryptedFile1]) =>
          oneTimePadBlobDecrypt(decryptedFile1, decryptedFileName, otpKey)
        )
        .then(([fileName, decryptedFile2]) => {
          plainFileInput.value = fileName;

          downloadPlainFileButton.onclick = () => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(decryptedFile2);
            link.download = fileName;
            link.click();
          };

          decryptOutputFileContainer.classList.remove("hidden");
        })
        .catch((error) => {
          console.error("File decryption failed:", error);
          displayToast("An error occurred during file decryption.");
        })
        .finally(() => {
          hideLoader();
        });
    } else {
      hideLoader();
      displayToast("Inputs successfully decrypted.");
    }
  } catch (error) {
    console.error("Decryption failed:", error);
    displayToast("An error occurred during decryption.");
    hideLoader();
  }
};

const copyToClipboard = (copyText, toastMessage) => {
  if (copyText && copyText.select) {
    copyText.select();
  }

  navigator.clipboard
    .writeText(copyText.value)
    .then(() => {
      displayToast(toastMessage);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
};

const displayToast = (message) => {
  toastText.textContent = message;
  toast.show();
};

const showLoader = () => {
    loader.classList.remove("d-none");
};

const hideLoader = () => {
    loader.classList.add("d-none");
};
