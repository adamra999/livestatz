import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useInfluencers } from "@/hooks/useInfluencers";

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, user, isAuthenticated, isInitialized: true };
    }
    default: {
      return state;
    }
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
});
export const AuthProvider = ({ children }) => {
  const { fetchInfluencerByEmail, addInfluencer, error } = useInfluencers();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  useEffect(() => {
    // Dispatch the login action to update the state
    dispatch({
      type: "INIT",
      payload: { isAuthenticated: true, user: {} },
    });
  }, []);
  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (location?.pathname == "/") {
          navigate("/dashboard");
        }
        // navigate("/dashboard");
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === "SIGNED_IN" && session?.user) {
        const user = session.user;
        const provider = session.user.app_metadata?.provider;
        if (location?.pathname == "/") {
          navigate("/dashboard");
        }
        console.log("🔹 Auth Provider:", provider);
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: true, user },
        });
        // ✅ Step 1: Verify if user logged in via Google SSO
        if (provider === "google") {
          console.log("✅ User signed in via Google SSO:", user.email);
          // ✅ Step 2: Check if this is their first time
          const influencer = await fetchInfluencerByEmail(user.email);
          if (!influencer) {
            // No record found → first-time user
            console.log("🆕 First-time Google user detected!");
            await addInfluencer(
              user.id,
              user?.user_metadata?.full_name,
              user.email
            );
          } else {
            console.log("👋 Returning Google user:", user.email);

            // Optional: update last login timestamp
          }
          if (location?.pathname == "/") {
            navigate("/dashboard");
          }
        } else {
          console.log("User logged in via other provider:", provider);
        }
        // navigate("/dashboard");
      } else if (event != "INITIAL_SESSION") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!state.isInitialized) return <div>Loading ..... </div>;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
