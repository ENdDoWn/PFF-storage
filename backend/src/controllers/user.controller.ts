import * as userModel from "../models/user.model";

export const getAllUsers = async () => {
  return await userModel.findAll();
};

export const getUserById = async ({ params }: any) => {
  const user = await userModel.findById(params.id);
  if (!user) return { error: "User not found" };
  return user;
};

export const createUser = async ({ body }: any) => {
  const newUser = await userModel.create(body);
  return newUser;
};
