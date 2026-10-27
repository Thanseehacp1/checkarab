import React, {useState} from 'react';
import {View, Text} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const SliderExample = () => {
  const [values, setValues] = useState([0, 1000]);

  const multiSliderValuesChange = values => {
    setValues(values);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>
        Selected Range: {values[0]} to {values[1]}
      </Text>
      <MultiSlider
        values={values}
        sliderLength={200}
        onValuesChange={multiSliderValuesChange}
        min={0}
        max={1000}
        step={1}
        allowOverlap={false}
        snapped={true}
      />
    </View>
  );
};

export default SliderExample;
