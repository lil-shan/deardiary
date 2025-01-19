import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Input, Button, Text, Icon } from "@rneui/themed";
import { useAuth } from "../contexts/AuthContext";

export const Signup: React.FC<{ onToggleAuth: () => void }> = ({
  onToggleAuth,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (email && password && confirmPassword && name) {
      if (password !== confirmPassword) {
        Alert.alert("Password Mismatch", "Passwords do not match");
        return;
      }
      const success = await signup(email, password, name);
      if (!success) {
        Alert.alert("Signup Failed", "Email already in use");
      }
    } else {
      Alert.alert("Invalid Input", "Please fill in all fields");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text h2 style={styles.title}>
            Create Account
          </Text>
          <Text style={styles.subtitle}>Join us and start your journey</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            leftIcon={
              <Icon
                name="person-outline"
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
            placeholder="Email Address"
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

          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            leftIcon={
              <Icon
                name="lock-outline"
                type="material"
                size={24}
                color="#6c757d"
              />
            }
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon
                  name={showConfirmPassword ? "visibility-off" : "visibility"}
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
            title="Create Account"
            onPress={handleSignup}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <Button
            title="Already have an account? Login"
            type="clear"
            onPress={onToggleAuth}
            containerStyle={styles.loginContainer}
            titleStyle={styles.loginText}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 32,
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
    fontSize: 16,
  },
  formContainer: {
    marginTop: 8,
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6c757d",
  },
  loginContainer: {
    marginTop: 8,
  },
  loginText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
