import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest) {
          const data = await createGuest({
            email: user.email,
            fullName: user.name
          });
          console.log(data);
        }

        return true;
      } catch {
        return false;
      }
    },

    // this call back runs after the signin callback and also each time the session is checked out example when we call the auth() function
    // this is where we will add the guest id to the session. we parse the session object. the session we parsed in is still the same as the session we ge when we call the auth() function
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;

      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST }
} = NextAuth(authConfig);
