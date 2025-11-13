import { ENV } from "@/lib/config/env";
import { login } from "@/services/auth/auth.login";
import { register } from "@/services/auth/auth.register";
import {
  Account,
  NextAuthOptions,
  User as NextAuthUser,
  Profile,
} from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@mail.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<NextAuthUser | null> {
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
      user: NextAuthUser | AdapterUser;
      account: Account | null;
      profile?: (Profile & { picture?: string }) | undefined;
    }) {
      if (account?.provider === "google") {
        try {
          const newUser = await register(
            {
              name: profile?.name || user.name,
              email: profile?.email || user.email,
              avatar: profile?.picture || user.avatar,
              provider: account.provider,
              providerId: account.providerAccountId,
              isVerified: true,
            },
            true,
          );

          if (newUser && (newUser.id || newUser.email)) {
            const address = {
              street: newUser.street,
              city: newUser.city,
              state: newUser.state,
              zip: newUser.zip,
            };

            user.id = newUser.id;
            user.email = newUser.email;
            user.role = newUser.role;
            user.name = newUser.name;
            user.avatar = newUser.avatar as string;
            user.isVerified = newUser.isVerified;
            user.provider = newUser.provider;
            user.phone = newUser.phone;
            user.address = address;
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

  secret: ENV.NEXT_AUTH_SECRET,

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  //
};
