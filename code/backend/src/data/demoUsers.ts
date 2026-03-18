import { DemoAuthUser } from "../types/auth";

export const demoUsers: DemoAuthUser[] = [
  {
    id: 9001,
    email: "admin@schoolvan.local",
    name: "School Admin",
    role: "admin",
    passwordSalt: "e86229e32ff66e7990ad736b07a0c677",
    passwordHash:
      "22568956b105115087737f052df6b15bdb91a2aae36550a74e99249806f78f9c66d174f6d65ccb0d3dbbd509b817768c6175fe1d986a0ebecae602e3473b837a",
  },
  {
    id: 1,
    email: "driver1@schoolvan.local",
    name: "Driver One",
    role: "driver",
    passwordSalt: "cfe28c858888da699031db950a90f81d",
    passwordHash:
      "a2eb0d13489fe999af7889cccbd8f1a283013cc555f63bc5fde0bcf596fdecc0f1793ab3212eb7a384e67d4b748332dad48be464b8f0baba78387ffba88747ee",
  },
  {
    id: 101,
    email: "parent1@schoolvan.local",
    name: "Parent One",
    role: "parent",
    passwordSalt: "87970ac15d5f2f8156967b69e4e34d1a",
    passwordHash:
      "aeef02967e54eb6261a73eb20554932df5cfee6478fcb0d076287f459f1178e0840924545f0b44f092af2a1d09f0814d95b0b4832b36a8dd87e154034750c051",
  },
];
