import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error("Error storing data", e);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error("Error retrieving data", e);
    return null;
  }
};

export const getJournals = async (userId: string) => {
  const journals = await getData(`journals_${userId}`);
  return journals ? JSON.parse(journals) : [];
};

export const addJournal = async (
  userId: string,
  journal: { title: string; content: string; date: string }
) => {
  const journals = await getJournals(userId);
  journals.push(journal);
  await storeData(`journals_${userId}`, JSON.stringify(journals));
};
