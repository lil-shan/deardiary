import React, { useEffect } from "react";
import { View, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import { Text } from "@rneui/themed";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Delay before calling onComplete
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.iconContainer}>
            {/* You can replace this with a custom icon or leave the styled text */}
            <Text style={styles.iconText}>📖</Text>
          </View>
          <Text style={styles.title}>Dear Diary</Text>
          <Text style={styles.subtitle}>Your Personal Companion App</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconText: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  subtitle: {
    fontSize: 16,
    color: "#6C757D",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
});
