# TashfeerCipher

## Description

TashfeerCipher is a cross-platform desktop application for encrypting and decrypting text and files using Rail Fence Cipher, One Time Pad, and a combination of both. It is built using Electron, allowing it to run as a cross-platform desktop application. The application leverages modern web technologies such as HTML, CSS, and JavaScript, along with the Bootstrap framework.

### Security Features

TashfeerCipher is designed with maximum security in mind by combining two encryption techniques:

#### One Time Pad (OTP)

The One Time Pad is an encryption technique that is theoretically unbreakable when used correctly. It involves using a randomly generated key that is as long as the message being encrypted. Each character of the plaintext is XORed with a character from the key. Since the key is random and used only once, it provides perfect secrecy. In TashfeerCipher, the key is randomly generated and expanded to match the length of the plaintext, ensuring robust encryption.

#### Rail Fence Cipher

The Rail Fence Cipher is a form of transposition cipher where the plaintext is written in a zigzag pattern across multiple "rails" and then read off row by row. This rearranges the characters of the plaintext, making it harder to decipher without knowing the pattern.

### Combined Encryption

TashfeerCipher combines both the One Time Pad and Rail Fence Cipher for maximum security. By first applying the Rail Fence Cipher to transpose the characters and then using the One Time Pad to encrypt the transposed text, we achieve a higher level of security. This dual-layer encryption ensures that even if one method is compromised, the other layer provides additional protection.

## Prerequisites

- You have installed [Node.js](https://nodejs.org/) 

## Installation

To get started with TashfeerCipher, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/MinoMakh/Substitution-Transposition-Encryption.git
    ```

2. Navigate to the project directory:
    ```bash
    cd Substitution-Transposition-Encryption
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage

To start the application, run the following command:
```bash
npm start
```
This will launch the Electron application, and you can begin using TashfeerCipher to encrypt and decrypt text and files.

## Building and Installing the Application

To build and execute the application, follow these steps:

1. Run the build command:
    ```bash
    npm run build
    ```

2. Navigate to the `dist` folder and search for your OS installer:
   - Windows (.exe)
   - macOS (.dmg or .pkg)
   - Linux (.deb, .AppImage, .rpm)

### Encrypting Text

Navigate to the Substitution, Transposition, or Both page.
Enter the text you want to encrypt in the provided text area.
Enter the encryption key if required.
Click the "Encrypt" button to encrypt the text.
The encrypted text will be displayed, and you can copy it to the clipboard.

### Decrypting Text

Navigate to the Substitution, Transposition, or Both page.
Enter the encrypted text in the provided text area.
Enter the decryption key if required.
Click the "Decrypt" button to decrypt the text.
The decrypted text will be displayed, and you can copy it to the clipboard.

### Encrypting Files

Navigate to the Substitution, Transposition, or Both page.
Select the file you want to encrypt using the file input.
Enter the encryption key if required.
Click the "Encrypt" button to encrypt the file.
The encrypted file will be available for download.

### Decrypting Files

Navigate to the Substitution, Transposition, or Both page.
Select the encrypted file using the file input.
Enter the decryption key if required.
Click the "Decrypt" button to decrypt the file.
The decrypted file will be available for download.

## Screenshots

![Substitution](https://github.com/user-attachments/assets/d0c1b549-242e-4764-9744-e65959bfd9b2)
![Transposition](https://github.com/user-attachments/assets/d9cd1e19-9d30-44a7-911e-f2e6acd255d1)
![Substitution&Transposition](https://github.com/user-attachments/assets/1d0095dc-79c9-4e77-962c-a80a8c02a85a)


