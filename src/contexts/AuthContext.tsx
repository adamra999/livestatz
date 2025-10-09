import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === "SIGNED_IN" && session?.user) {
        const user = session.user;
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: true, user },
        });
        // navigate("/dashboard");
      } else if (event === "SIGNED_OUT") {
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
