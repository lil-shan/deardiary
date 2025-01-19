import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import { Signup } from "./components/signup";
import { Profile } from "./components/Profile";
import { Home } from "./components/Home";
import { SplashScreen } from "./components/SplashScreen";
import { NavigationContainer } from "@react-navigation/native";

const AuthenticatedApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"home" | "profile">("home");
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <View style={styles.container}>
      {currentPage === "home" ? <Home /> : <Profile />}
      <View style={styles.navBar}>
        <Button
          title="Home"
          onPress={() => setCurrentPage("home")}
          type={currentPage === "home" ? "solid" : "outline"}
          containerStyle={styles.navButton}
        />
        <Button
          title="Profile"
          onPress={() => setCurrentPage("profile")}
          type={currentPage === "profile" ? "solid" : "outline"}
          containerStyle={styles.navButton}
        />
      </View>
    </View>
  );
};

const UnauthenticatedApp: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => setIsLogin(!isLogin);

  return isLogin ? (
    <Login onToggleAuth={toggleAuth} />
  ) : (
    <Signup onToggleAuth={toggleAuth} />
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  navButton: {
    minWidth: 100,
  },
});

export default App;
