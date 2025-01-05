const {
  generatePseudoRandomKey,
  oneTimePadEncrypt,
  oneTimePadDecrypt,
  oneTimePadFileEncrypt,
  oneTimePadFileDecrypt,
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
  cipherCopyButton = document.getElementById("copy-cipher-button");

//  Decryption DOM Elements
// prettier-ignore
const decryptButton = document.getElementById("decrypt-button"),
  decryptKeyInput = document.getElementById("decrypt-key-input"),
  decryptInput = document.getElementById("decrypt-input"),
  decryptFile = document.getElementById("decrypt-file"),
  decryptOutputContainer = document.getElementById("decrypt-output-container"),
  decryptOutput = document.getElementById("decrypt-output"),
  decryptOutputTextContainer = document.getElementById("decrypt-output-text-container"),
  plainFileInput = document.getElementById("plain-file-name"),
  downloadPlainFileButton = document.getElementById("download-plain-file-button"),
  decryptOutputFileContainer = document.getElementById("decrypt-output-file-container"),
  plainCopyButton = document.getElementById("copy-plain-button");

encryptButton.onclick = () => handleSubstitutionEncryption();

decryptButton.onclick = () => handleSubstitutionDecryption();

const handleSubstitutionEncryption = () => {
  // If no file and text is entered display toast
  if (!encryptFile.files.length && encryptInput.value === "") {
    displayToast("Please enter a text or file to encrypt.");
    return;
  }

  showLoader();
  encryptOutputContainer.classList.remove("hidden");
  const key = generatePseudoRandomKey();

  copyKeyButton.onclick = () =>
    copyToClipboard({ value: key }, "Key copied to clipboard.");

  try {
    if (encryptInput.value !== "") {
      const encryptedText = oneTimePadEncrypt(encryptInput.value, key);
      encryptOutput.textContent = encryptedText;
      encryptOutputTextContainer.classList.remove("hidden");

      cipherCopyButton.onclick = () =>
        copyToClipboard(encryptOutput, "Cipher text copied to clipboard.");
    }

    if (encryptFile.files.length) {
      oneTimePadFileEncrypt(encryptFile, key)
        .then(([fileName, encryptedFile]) => {
          cipherEncryptFileInput.value = fileName;

          downloadEncryptCipherFileButton.onclick = () => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(encryptedFile);
            link.download = fileName;
            link.click();
          };
        })
        .catch((error) => {
          console.error("File encryption failed:", error);
          displayToast("An error occurred during file encryption.");
        })
        .finally(() => {
          hideLoader();
        });

      encryptOutputFileContainer.classList.remove("hidden");
    } else {
      hideLoader();
      displayToast("Inputs successfully encrypted.");
    }
  } catch (error) {
    console.error("Encryption failed:", error);
    displayToast("An error occurred during encryption.");
    hideLoader();
  }
};

const handleSubstitutionDecryption = () => {
  // If no file and text is entered display toast
  if (!decryptFile.files.length && decryptInput.value === "") {
    displayToast("Please enter a text or file to decrypt.");
    return;
  }

  // If no key is entered display a toast
  if (decryptKeyInput.value === "") {
    displayToast("Please enter a key to decrypt.");
    return;
  }

  showLoader();
  decryptOutputContainer.classList.remove("hidden");

  try {
    if (decryptInput.value !== "") {
      const decryptedText = oneTimePadDecrypt(
        decryptInput.value,
        decryptKeyInput.value
      );

      decryptOutput.textContent = decryptedText;
      decryptOutputTextContainer.classList.remove("hidden");

      plainCopyButton.onclick = () =>
        copyToClipboard(decryptOutput, "Plain text copied to clipboard.");
    }

    if (decryptFile.files.length) {
      oneTimePadFileDecrypt(decryptFile, decryptKeyInput.value)
        .then(([fileName, decryptedFile]) => {
          plainFileInput.value = fileName;

          downloadPlainFileButton.onclick = () => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(decryptedFile);
            link.download = fileName;
            link.click();
          };
        })
        .catch((error) => {
          console.error("File decryption failed:", error);
          displayToast("An error occurred during file decryption.");
        })
        .finally(() => {
          hideLoader();
        });

      decryptOutputFileContainer.classList.remove("hidden");
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
