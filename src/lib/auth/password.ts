import { hash, verify } from "@node-rs/argon2";

const passwordOptions = {
  algorithm: 2,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
  outputLen: 32
};

export async function hashPassword(password: string) {
  return hash(password, passwordOptions);
}

export async function verifyPassword(passwordHash: string, candidatePassword: string) {
  return verify(passwordHash, candidatePassword, passwordOptions);
}
