import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card } from "@rneui/themed";
import { LineChart } from "react-native-chart-kit";

interface JournalTrendsProps {
  entries: Array<{
    date: string;
    content: string;
    analysis?: any;
  }>;
}

export const JournalTrends: React.FC<JournalTrendsProps> = ({ entries }) => {
  // Calculate mood trends (assuming mood is scored 1-10)
  const moodData = entries.map((entry) => ({
    date: new Date(entry.date),
    score: entry.analysis?.moodScore || 5,
  }));

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title>Mood Trends</Card.Title>
        <LineChart
          data={{
            labels: moodData.map((d) => d.date.toLocaleDateString()),
            datasets: [
              {
                data: moodData.map((d) => d.score),
              },
            ],
          }}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
      </Card>

      {/* Add more trend analysis cards here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
