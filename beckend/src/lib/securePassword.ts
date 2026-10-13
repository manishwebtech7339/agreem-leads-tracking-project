import crypto from "crypto";

export const hashPassword = (
  password: string,
  defaultSalt?: string,
): Promise<{
  password: string;
  salt: string;
}> => {
  return new Promise((resolve) => {
    const salt = defaultSalt || crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      resolve({ password: derivedKey.toString("hex"), salt });
    });
  });
};

export const validatePassword = async (
  password: string,
  hash: string,
  salt: string,
) => {
  var hashToValidate = await hashPassword(password, salt);
  return hash === hashToValidate.password;
};
