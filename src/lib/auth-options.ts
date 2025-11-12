import { Account, NextAuthOptions, Profile, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@mail.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials as Record<
          "email" | "password",
          string
        >;

        if (!email || !password) return null;

        try {
          const user = await login({ email, password });

          if (user && user?.email) {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
              name: user.name,
              avatar: user.avatar,
              isVerified: user.isVerified,
              provider: user.provider,
              phone: user.phone,
              address: {
                street: user.street,
                city: user.city,
                state: user.state,
                zip: user.zip,
              },
            };
          } else return null;

          //
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.avatar = user.avatar;
        token.isVerified = user.isVerified;
        token.provider = user.provider;
        token.phone = user.phone;
        token.address = user.address;
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.avatar = token.avatar;
        session.user.isVerified = token.isVerified;
        session.user.provider = token.provider;
        session.user.phone = token.phone;
        session.user.address = token.address;
      }

      return session;
    },

    async signIn({
      user,
      account,
      profile,
    }: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: (Profile & { picture?: string }) | undefined;
    }) {
      if (account?.provider === "google") {
        try {
          const newUser = await register({
            name: user.name || profile?.name,
            email: user.email || profile?.email || "",
            role: "USER",
            avatar: user.avatar || profile?.picture,
            provider: account.provider,
            providerId: account.providerAccountId,
            isVerified: true,
          });

          if (newUser && (newUser.id || newUser.email)) {
            user.id = newUser.id;
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error registering Google user:", error);
          return false;
        }
      }

      return true;
    },

    //
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXT_AUTH_SECRET ?? "",

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  //
};
