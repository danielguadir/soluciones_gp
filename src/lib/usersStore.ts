export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  provider: "credentials" | "google";
  createdAt: string;
}

// In-memory store for registered user accounts
const globalUsersStore: UserAccount[] = [
  {
    id: "user-demo-1",
    name: "Usuario Demo",
    email: "usuario@impulsogp.com",
    password: "Password123!",
    avatarUrl: "/images/default-avatar.png",
    provider: "credentials",
    createdAt: new Date().toISOString(),
  },
];

export const findUserByEmail = (email: string): UserAccount | undefined => {
  const cleanEmail = email.trim().toLowerCase();
  return globalUsersStore.find((u) => u.email.toLowerCase() === cleanEmail);
};

export const registerUserInMemory = (data: {
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  provider?: "credentials" | "google";
}): UserAccount => {
  const cleanEmail = data.email.trim().toLowerCase();
  const existing = findUserByEmail(cleanEmail);

  if (existing) {
    if (data.provider === "google") {
      return existing;
    }
    throw new Error("El correo electrónico ya se encuentra registrado.");
  }

  const newUser: UserAccount = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
    name: data.name,
    email: cleanEmail,
    password: data.password,
    avatarUrl: data.avatarUrl || "/images/default-avatar.png",
    provider: data.provider || "credentials",
    createdAt: new Date().toISOString(),
  };

  globalUsersStore.push(newUser);
  return newUser;
};
