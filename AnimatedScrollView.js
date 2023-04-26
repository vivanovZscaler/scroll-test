// @ts-nocheck
import { ScrollView, Animated, View } from 'react-native';
import { Fragment, useState } from 'react';

const getOffsets = (offset, height, min) => {
  const cardScales = [];
  const buttonIndices = []
  let remainingOffset = offset;

  height.forEach((h, i) => {
    const itemScale = {};
    if (remainingOffset <= 0) {
      itemScale.scale = 1;
    } else if ((remainingOffset - h) <= 0) {
      itemScale.scale = Math.max(0, Math.min(1, (h - remainingOffset) / h));
      itemScale.offset = remainingOffset;
    } else {
      itemScale.scale = 0;
    }
    if (itemScale.scale < min) { itemScale.scale = 0; }
    if (itemScale.scale === 0) { buttonIndices.push(i)}
    cardScales.push(itemScale);
    remainingOffset -= h;
  });

  return { cardScales, buttonIndices }
};


export default function AnimatedScrollView({cards = [], minScale = 0, buttonRowStyle, ...props}) {
  const [offset, setOffset] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(Array.from({length: cards.length}));

  const handleScroll = ({nativeEvent: {contentOffset: { y } } }) => {console.log('scrolled'); setOffset(y);}

  const handleLayout = ({nativeEvent: {layout = {}} = {} }, index) => {
    const {width: w, height: h} = layout;
    if (!width) { setWidth(w); }
    const newHeight = [...height];
    newHeight[index] = h;
    setHeight(newHeight);
  }

  const { cardScales, buttonIndices } = getOffsets(offset, height, minScale);

  return (
    <View style={{flex: 1}}>
        {buttonIndices.length > 0 && (
          <View style={[{flexDirection: 'row'},buttonRowStyle]}>
            {buttonIndices.map(item => {
              if (!cards[item]?.button || cards[item].noScale) { return null; }
              return (<Fragment key={item}>{cards[item].button}</Fragment>)
            })}
          </View>
        )}
        <ScrollView
          alwaysBounceVertical={false}
          contentInsetAdjustmentBehavior="never"
          onScroll={handleScroll}
          scrollEventThrottle={10}
          {...props}
        >
          {cards.map(({card, noScale = false, position = 'left'}, index) => {
            if (noScale) {return card;}

            const {scale = 1, offset: o = 0} = cardScales[index] || {};
            const cardStyle = {transform: [{scale}]};

            // scaling goes from edges to the center,
            // therefore if we want to keep the button in the top-left corner, we have to apply margins
            if (scale < 1) {
              cardStyle.marginTop = (o) / 2;
              cardStyle.marginBottom = -o / 2;
              if (position !== 'center') {
                cardStyle.marginLeft = (scale - 1) * width * 0.5;
                cardStyle.marginRight = -cardStyle.marginLeft;
                if (position === 'right') {
                  cardStyle.marginLeft *= -1;
                  cardStyle.marginRight *= -1;
                }
              }
            }

            return (
              <Animated.View key={index} onLayout={(ev) => handleLayout(ev, index)}>
                <View style={cardStyle}>{card}</View>
            </Animated.View>
            )
          })}
        </ScrollView>
      </View>
  );
}
