import CryptoJS from "crypto-js";

const encryptionManager = {
  encrypt: (text: string) => {
    return CryptoJS.AES.encrypt(
      text,
      import.meta.env.VITE_JWT_SECRET,
    ).toString();
  },

  decrypt: (cipherText: string) => {
    const bytes = CryptoJS.AES.decrypt(
      cipherText,
      import.meta.env.VITE_JWT_SECRET,
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  },
};

export default encryptionManager;
