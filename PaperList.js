import React from 'react';
import {List, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ProductsList from './ProductListing';

const ListItem = () => {
  const [expanded, setExpanded] = React.useState(true);
  const {colors} = useTheme();

  const handlePress = () => setExpanded(!expanded);

  return (
    <List.Accordion
      title="Apple Products"
      style={{backgroundColor: 'black', marginHorizontal: 10}}
      expanded={expanded}
      onPress={handlePress}
      titleStyle={{
        color: colors.secondary,
        fontFamily: 'Poppins-Medium',
        fontSize: 17,
      }} // Set the font color to white
      right={props => (
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.secondary}
        />
      )}>
      <ProductsList customStyle={{marginTop: 15}} />
    </List.Accordion>
  );
};

export default ListItem;
