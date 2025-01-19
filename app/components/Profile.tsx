import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, Input, Button, Avatar, Icon } from "@rneui/themed";
import { useAuth } from "../contexts/AuthContext";

export const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    await updateProfile(name, bio);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: logout,
        style: "destructive",
      },
    ]);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Avatar
          size={100}
          rounded
          title={getInitials(user?.name || "User")}
          containerStyle={styles.avatar}
          overlayContainerStyle={{ backgroundColor: "#007AFF" }}
        />
        <Text style={styles.username}>@{user?.email?.split("@")[0]}</Text>
        <Text style={styles.joinDate}>Joined January 2025</Text>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <View style={styles.editForm}>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              containerStyle={styles.input}
              leftIcon={
                <Icon
                  name="person-outline"
                  type="ionicon"
                  size={24}
                  color="#666"
                  style={styles.inputIcon}
                />
              }
              placeholder="Enter your name"
            />
            <Input
              label="Bio"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              containerStyle={styles.input}
              leftIcon={
                <Icon
                  name="information-circle-outline"
                  type="ionicon"
                  size={24}
                  color="#666"
                  style={styles.inputIcon}
                />
              }
              placeholder="Tell us about yourself"
              inputStyle={styles.bioInput}
            />
            <View style={styles.editButtons}>
              <Button
                title="Cancel"
                onPress={() => setIsEditing(false)}
                type="outline"
                containerStyle={[styles.button, styles.cancelButton]}
                buttonStyle={styles.cancelButtonStyle}
              />
              <Button
                title="Save Changes"
                onPress={handleUpdate}
                containerStyle={[styles.button, styles.saveButton]}
                buttonStyle={styles.saveButtonStyle}
              />
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Icon
                    name="mail-outline"
                    type="ionicon"
                    size={24}
                    color="#666"
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{user?.email}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Icon
                    name="person-outline"
                    type="ionicon"
                    size={24}
                    color="#666"
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Name</Text>
                    <Text style={styles.infoValue}>
                      {user?.name || "Not set"}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Icon
                    name="information-circle-outline"
                    type="ionicon"
                    size={24}
                    color="#666"
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Bio</Text>
                    <Text style={styles.infoValue}>
                      {user?.bio || "No bio yet."}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              containerStyle={styles.editButton}
              buttonStyle={styles.editButtonStyle}
              icon={
                <Icon
                  name="create-outline"
                  type="ionicon"
                  size={20}
                  color="white"
                  style={styles.buttonIcon}
                />
              }
            />
          </View>
        )}

        <Button
          title="Logout"
          onPress={handleLogout}
          type="clear"
          containerStyle={styles.logoutButton}
          titleStyle={styles.logoutButtonText}
          icon={
            <Icon
              name="log-out-outline"
              type="ionicon"
              size={20}
              color="#DC3545"
              style={styles.buttonIcon}
            />
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFF",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  avatar: {
    marginBottom: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
  },
  joinDate: {
    fontSize: 14,
    color: "#6C757D",
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  editForm: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    marginLeft: 0,
  },
  saveButton: {
    marginRight: 0,
  },
  cancelButtonStyle: {
    borderColor: "#CED4DA",
  },
  saveButtonStyle: {
    backgroundColor: "#007AFF",
  },
  profileInfo: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6C757D",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#212529",
  },
  editButton: {
    marginTop: 8,
  },
  editButtonStyle: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
  },
  logoutButton: {
    marginTop: 8,
  },
  logoutButtonText: {
    color: "#DC3545",
  },
  buttonIcon: {
    marginRight: 8,
  },
});
