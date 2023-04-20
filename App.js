// @ts-nocheck
import { StyleSheet } from 'react-native';
import { Button, Provider as PaperProvider, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedScrollView from './AnimatedScrollView';

const CardTemplate = ({index}) => (
  <Card style={{marginVertical: 10}}>
    <Card.Title title={`Card ${index}`} subtitle="Card Subtitle" />
    <Card.Content>
      <Text variant="titleLarge">Card {index}</Text>
    </Card.Content>
    <Card.Cover source={{ uri: `https://picsum.photos/70${index}` }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button onPress={() => console.log(1)}>Ok</Button>
    </Card.Actions>
  </Card>
);

const ButtonTemplate = ({index}) => (
  <Button mode='contained' onPress={() => console.log(index)} style={{marginRight: 10}}>
    {`Card ${index}`}
  </Button>
);

export default function App() {
  const cards = Array.from({length: 8}).map((_, index) => ({
    button: <ButtonTemplate index={index} />,
    card: <CardTemplate index={index} />,
    noScale: index === 4,
    position: index % 3 === 0 ? 'left' : (index % 3 === 1 ? 'center' : 'right')
  }));

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <AnimatedScrollView
          cards={cards}
          contentContainerStyle={{paddingHorizontal: 10}}
          minScale={0.1}
          buttonRowStyle={{marginBottom: 10}}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5
  }
});
