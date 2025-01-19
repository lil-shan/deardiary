import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import { Text, Input, Button, Icon } from "@rneui/themed";
import { useAuth } from "../contexts/AuthContext";
import { getJournals, addJournal } from "../utils/storage";
import { analyzeJournal } from "../utils/journalAnalysis";
import { JournalAnalysis } from "../components/JournalAnalysis";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [journals, setJournals] = useState<
    Array<{ title: string; content: string; date: string }>
  >([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newJournalTitle, setNewJournalTitle] = useState("");
  const [newJournalContent, setNewJournalContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBoredModalVisible, setBoredModalVisible] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    if (user) {
      setIsLoading(true);
      const userJournals = await getJournals(user.email);
      setJournals(userJournals);
      setIsLoading(false);
    }
  };
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBoredButton = () => {
    animateButton();
    setBoredModalVisible(true);
  };
  const handleAddJournal = async () => {
    if (user && newJournalTitle && newJournalContent) {
      setIsLoading(true);
      const newJournal = {
        title: newJournalTitle,
        content: newJournalContent,
        date: new Date().toISOString(),
      };
      await addJournal(user.email, newJournal);
      setNewJournalTitle("");
      setNewJournalContent("");
      setModalVisible(false);
      await loadJournals();
      setIsLoading(false);
    }
  };
  const openBoredButton = async () => {
    try {
      await Linking.openURL("https://www.boredbutton.com/random");
    } catch (error) {
      Alert.alert("Error", "Could not open the link");
    }
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text h3 style={styles.title}>
            Journal Entries
          </Text>
        </View>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.name || "User"}
        </Text>
        {/* Bored Button Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isBoredModalVisible}
          onRequestClose={() => setBoredModalVisible(false)}
        >
          <View style={styles.boredModalContainer}>
            <View style={styles.boredModalHeader}>
              <Text style={styles.boredModalTitle}>Bored Button</Text>
              <TouchableOpacity
                onPress={() => setBoredModalVisible(false)}
                style={styles.boredCloseButton}
              >
                <Icon name="close" type="ionicon" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <WebView
              source={{ uri: "https://www.boredbutton.com/random" }}
              style={styles.webview}
              startInLoadingState={true}
              renderLoading={() => (
                <ActivityIndicator
                  style={styles.webviewLoader}
                  size="large"
                  color="#007AFF"
                />
              )}
            />
          </View>
        </Modal>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <ScrollView
          style={styles.journalList}
          showsVerticalScrollIndicator={false}
        >
          {journals.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="book-outline" type="ionicon" size={64} color="#ccc" />
              <Text style={styles.emptyStateText}>
                No journals yet. Start writing!
              </Text>
            </View>
          ) : (
            journals.map((journal, index) => (
              <TouchableOpacity
                key={index}
                style={styles.journalItem}
                activeOpacity={0.7}
              >
                <View style={styles.journalHeader}>
                  <Text style={styles.journalTitle}>{journal.title}</Text>
                  <Icon
                    name="chevron-forward"
                    type="ionicon"
                    size={20}
                    color="#007AFF"
                  />
                </View>
                <Text numberOfLines={2} style={styles.journalPreview}>
                  {journal.content}
                </Text>
                <Text style={styles.journalDate}>
                  {formatDate(journal.date)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Icon name="add" type="ionicon" color="#FFF" size={30} />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBoredModalVisible}
        onRequestClose={() => setBoredModalVisible(false)}
      >
        <View style={styles.boredModalContainer}>
          <View style={styles.boredModalHeader}>
            <Text style={styles.boredModalTitle}>Bored Button</Text>
            <TouchableOpacity
              onPress={() => setBoredModalVisible(false)}
              style={styles.boredCloseButton}
            >
              <Icon name="close" type="ionicon" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: "https://www.boredbutton.com/random" }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator
                style={styles.webviewLoader}
                size="large"
                color="#007AFF"
              />
            )}
          />
        </View>
      </Modal>
      <Animated.View
        style={[
          styles.boredButtonContainer,
          {
            transform: [{ scale: buttonScale }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.boredButton}
          onPress={handleBoredButton}
          activeOpacity={0.9}
        >
          <Icon name="game-controller" type="ionicon" size={24} color="#FFF" />
          <Text style={styles.boredButtonText}>I'm Bored!</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text h4 style={styles.modalTitle}>
                New Journal Entry
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" type="ionicon" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Input
              placeholder="Title"
              value={newJournalTitle}
              onChangeText={setNewJournalTitle}
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.input}
              leftIcon={
                <Icon
                  name="create-outline"
                  type="ionicon"
                  size={24}
                  color="#666"
                />
              }
            />

            <Input
              placeholder="Write your thoughts..."
              value={newJournalContent}
              onChangeText={setNewJournalContent}
              multiline
              numberOfLines={8}
              containerStyle={styles.inputContainer}
              inputContainerStyle={[styles.input, styles.contentInput]}
              inputStyle={styles.contentInputText}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                type="outline"
                containerStyle={[styles.modalButton, styles.cancelButton]}
                buttonStyle={styles.cancelButtonStyle}
              />
              <Button
                title="Save Entry"
                onPress={handleAddJournal}
                containerStyle={[styles.modalButton, styles.saveButton]}
                buttonStyle={styles.saveButtonStyle}
                disabled={!newJournalTitle || !newJournalContent}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  title: {
    color: "#212529",
    marginBottom: 8,
  },
  welcomeText: {
    color: "#6C757D",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  journalList: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyStateText: {
    marginTop: 16,
    color: "#6C757D",
    fontSize: 16,
  },
  journalItem: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  journalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    flex: 1,
  },
  journalPreview: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 12,
    lineHeight: 20,
  },
  journalDate: {
    fontSize: 12,
    color: "#ADB5BD",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#212529",
    fontSize: 20,
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderColor: "#DEE2E6",
    backgroundColor: "#F8F9FA",
  },
  contentInput: {
    minHeight: 120,
    alignItems: "flex-start",
  },
  contentInputText: {
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  boredButtonContainer: {
    position: "absolute",
    left: 20,
    bottom: 20,
  },
  boredButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  boredButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  boredModalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  boredModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
  },
  boredModalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
  boredCloseButton: {
    padding: 4,
  },

  webview: {
    flex: 1,
  },
  webviewLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
});
