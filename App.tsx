import React, { useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";

const mockScoreDataAsc = [
  { date: new Date(2024, 6, 29), score: 75 },
  { date: new Date(2024, 6, 30), score: 82 },
  { date: new Date(2024, 6, 31), score: 58 },
  { date: new Date(2024, 7, 1), score: 93 },
  { date: new Date(2024, 7, 2), score: 69 },
  { date: new Date(2024, 7, 3), score: 87 },
  { date: new Date(2024, 7, 4), score: 45 },
  { date: new Date(2024, 7, 5), score: 91 },
  { date: new Date(2024, 7, 6), score: 63 },
  { date: new Date(2024, 7, 7), score: 79 },
];

const mockScoreDataDesc = [
  { date: new Date(2024, 7, 7), score: 79 },
  { date: new Date(2024, 7, 6), score: 63 },
  { date: new Date(2024, 7, 5), score: 91 },
  { date: new Date(2024, 7, 4), score: 45 },
  { date: new Date(2024, 7, 3), score: 87 },
  { date: new Date(2024, 7, 2), score: 69 },
  { date: new Date(2024, 7, 1), score: 93 },
  { date: new Date(2024, 6, 31), score: 58 },
  { date: new Date(2024, 6, 30), score: 82 },
  { date: new Date(2024, 6, 29), score: 75 },
];

export type ScoreData = (typeof mockScoreDataAsc)[number];

const screenWidth = Dimensions.get("window").width;
const itemWidth = 96;
const buttonWidth = 80;
const centerOffset = (screenWidth - itemWidth) / 2;
const lastIndex = mockScoreDataAsc.length - 1;

export default function App() {
  const listRef1 = useRef(null);
  const listRef2 = useRef(null);
  const listRef3 = useRef(null);
  const listRef4 = useRef(null);
  const [selectedIndex1, setSelectedIndex1] = useState(0);
  const [selectedIndex2, setSelectedIndex2] = useState(0);
  const [selectedIndex3, setSelectedIndex3] = useState(0);
  const [selectedIndex4, setSelectedIndex4] = useState(lastIndex);

  const scrollToIndex = (index, listRef, setSelectedIndex) => {
    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
    setSelectedIndex(index);
  };

  const scrollToOffset = (index, listRef, setSelectedIndex) => {
    const offset = index * itemWidth;
    listRef.current?.scrollToOffset({
      offset,
      animated: true,
    });
    setSelectedIndex(index);
  };

  const renderItem = useCallback(
    ({ item, index }, listNumber) => (
      <View style={{ width: itemWidth }}>
        <Pressable
          onPress={() => {
            switch (listNumber) {
              case 1:
                scrollToIndex(index, listRef1, setSelectedIndex1);
                break;
              case 2:
                scrollToIndex(index, listRef2, setSelectedIndex2);
                break;
              case 3:
                scrollToOffset(index, listRef3, setSelectedIndex3);
                break;
              case 4:
                scrollToIndex(index, listRef4, setSelectedIndex4);
                break;
            }
          }}
          style={[
            styles.item,
            (listNumber === 1 && index === selectedIndex1) ||
            (listNumber === 2 && index === selectedIndex2) ||
            (listNumber === 3 && index === selectedIndex3) ||
            (listNumber === 4 && index === selectedIndex4)
              ? styles.selectedItem
              : null,
          ]}
        >
          <Text style={styles.dateText}>{item.date.toLocaleDateString()}</Text>
          <Text style={styles.scoreText}>{item.score}</Text>
        </Pressable>
      </View>
    ),
    [selectedIndex1, selectedIndex2, selectedIndex3, selectedIndex4]
  );

  const keyExtractor = useCallback(
    (item: ScoreData) => item.date.toISOString(),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <Text style={styles.header}>
          FlashList scrollToIndex - (Doesn't account for padding at first index)
        </Text>
        <View style={styles.container}>
          <FlashList
            ref={listRef1}
            data={mockScoreDataDesc}
            extraData={selectedIndex1}
            renderItem={(props) => renderItem(props, 1)}
            keyExtractor={keyExtractor}
            estimatedItemSize={itemWidth}
            estimatedListSize={{ height: 120, width: screenWidth }}
            estimatedFirstItemOffset={centerOffset}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 4,
              paddingTop: 4,
              paddingLeft: centerOffset,
              paddingRight: centerOffset,
            }}
          />
        </View>
        <Text style={styles.header}>
          FlashList inverted scrollToIndex - (Doesn't account for padding at
          first index)
        </Text>
        <View style={styles.container}>
          <FlashList
            ref={listRef2}
            data={mockScoreDataDesc}
            extraData={selectedIndex2}
            renderItem={(props) => renderItem(props, 2)}
            keyExtractor={keyExtractor}
            estimatedItemSize={itemWidth}
            estimatedListSize={{ height: 120, width: screenWidth }}
            estimatedFirstItemOffset={centerOffset}
            horizontal
            inverted
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 4,
              paddingTop: 4,
              paddingLeft: centerOffset,
              paddingRight: centerOffset,
            }}
          />
        </View>
        <Text style={styles.header}>
          FlashList inverted scrollToOffset - (works)
        </Text>
        <View style={styles.container}>
          <FlashList
            ref={listRef3}
            data={mockScoreDataDesc}
            extraData={selectedIndex3}
            renderItem={(props) => renderItem(props, 3)}
            keyExtractor={keyExtractor}
            estimatedItemSize={itemWidth}
            estimatedListSize={{ height: 120, width: screenWidth }}
            estimatedFirstItemOffset={centerOffset}
            horizontal
            inverted
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 4,
              paddingTop: 4,
              paddingLeft: centerOffset,
              paddingRight: centerOffset,
            }}
          />
        </View>
        <Text style={styles.header}>
          {`initialScrollIndex as last item - (not working)`}
        </Text>
        <View style={styles.container}>
          <FlashList
            ref={listRef4}
            data={mockScoreDataAsc}
            extraData={selectedIndex4}
            renderItem={(props) => renderItem(props, 4)}
            keyExtractor={keyExtractor}
            estimatedItemSize={itemWidth}
            estimatedListSize={{ height: 120, width: screenWidth }}
            estimatedFirstItemOffset={centerOffset}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 4,
              paddingTop: 4,
              paddingLeft: centerOffset,
              paddingRight: centerOffset,
            }}
            initialScrollIndex={lastIndex}
            // disableHorizontalListHeightMeasurement
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  item: {
    width: buttonWidth,
    height: buttonWidth,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 9999,
  },
  selectedItem: {
    backgroundColor: "#4a90e2",
  },
  dateText: {
    fontSize: 14,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
