import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Input, Button, Text, Icon } from "@rneui/themed";
import { useAuth } from "../contexts/AuthContext";

export const Login: React.FC<{ onToggleAuth: () => void }> = ({
  onToggleAuth,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (email && password) {
      const success = await login(email, password);
      if (!success) {
        Alert.alert("Login Failed", "Invalid email or password");
      }
    } else {
      Alert.alert("Invalid Input", "Please enter both email and password");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Logo or Brand Image could go here */}
        <Text h2 style={styles.title}>
          Welcome Back
        </Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.formContainer}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={
              <Icon
                name="mail-outline"
                type="material"
                size={24}
                color="#6c757d"
              />
            }
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            inputContainerStyle={styles.inputField}
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon={
              <Icon
                name="lock-outline"
                type="material"
                size={24}
                color="#6c757d"
              />
            }
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? "visibility-off" : "visibility"}
                  type="material"
                  size={24}
                  color="#6c757d"
                />
              </TouchableOpacity>
            }
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            inputContainerStyle={styles.inputField}
          />

          <Button
            title="Login"
            onPress={handleLogin}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />

          <Button
            title="Don't have an account? Sign Up"
            type="clear"
            onPress={onToggleAuth}
            containerStyle={styles.signUpContainer}
            titleStyle={styles.signUpText}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    color: "#1a1a1a",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    color: "#6c757d",
    marginBottom: 32,
    fontSize: 16,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  input: {
    paddingLeft: 8,
    color: "#1a1a1a",
  },
  buttonContainer: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signUpContainer: {
    marginTop: 16,
  },
  signUpText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
