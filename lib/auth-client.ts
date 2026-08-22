import { adminClient} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
    plugins: [adminClient()]
})

export const {signUp, signIn, signOut} = authClient