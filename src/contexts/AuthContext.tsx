import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

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

const AuthContext = createContext<{
  user: User | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  method: string;
}>({
  ...initialState,
  method: "JWT",
});
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
      if (session) {
        if (location?.pathname == "/") {
          navigate("/dashboard");
        }
        // navigate("/dashboard");
      } else {
        if (
          location?.pathname != "/" &&
          location?.pathname != "/auth" &&
          !location?.pathname.includes("/e/")
        ) {
          navigate("/");
        }
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      
      if (session && event === "SIGNED_IN" && user) {
        const provider = user.app_metadata?.provider;
        if (location?.pathname == "/") {
          navigate("/dashboard");
        }
        console.log("🔹 Auth Provider:", provider);
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: true, user },
        });
        
        // Handle Google SSO user registration
        if (provider === "google") {
          console.log("✅ User signed in via Google SSO:", user.email);
          
          // Defer Supabase calls to avoid deadlock
          setTimeout(async () => {
            try {
              const { data: influencer } = await supabase
                .from("Influencers")
                .select("*")
                .eq("email", user.email)
                .maybeSingle();
              
              if (!influencer) {
                console.log("🆕 First-time Google user detected!");
                await supabase.from("Influencers").insert([{
                  id: user.id,
                  name: user?.user_metadata?.full_name || "",
                  email: user.email || "",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }]);
              } else {
                console.log("👋 Returning Google user:", user.email);
              }
            } catch (error) {
              console.error("Error handling influencer registration:", error);
            }
          }, 0);
          
          if (location?.pathname == "/") {
            navigate("/dashboard");
          }
        } else {
          console.log("User logged in via other provider:", provider);
        }
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
        user: currentUser,
        method: "JWT",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
