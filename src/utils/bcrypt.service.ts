import bcrypt from "bcrypt";

const saltRounds = 10;

export const encrypt = async (password: string) => await bcrypt.hash(password, saltRounds);

export const decrypt = async (password: string, hash: string) => await bcrypt.compare(password, hash);
