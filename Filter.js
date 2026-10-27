import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Button,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import {Add} from 'iconsax-react-native';
import {useTheme, List, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {CloseCircle} from 'iconsax-react-native';
import {Filter, Sort} from 'iconsax-react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {useQuery} from '@apollo/client';
import {
  GET_ACTIVE_CHILD_CATEGORIES,
 GET_ATTRIBUTES_WITH_CATEGORY,
  GET_FILTER_COUNT,
  GET_PRODUCTS,GET_BRANDS
} from '../../graphQl/queries/Queries';

const {width, height} = Dimensions.get('window');

function FilterProducts({setVariables,setShowFilter,showFilter,itemscount,variables}) {
  const {colors} = useTheme();
  const navigation = useNavigation();
   const screenWidth = Dimensions.get('window').width;
   const numberOfColumns = 2;
  const containerWidth = (screenWidth - 30) / numberOfColumns;
  const {loading, data} = useQuery(GET_ACTIVE_CHILD_CATEGORIES, {
    variables: {
      input: {
        parent: null,
      },
    },
  });
 const {loading1, data:brandsData} = useQuery(GET_BRANDS, {
    variables: {
      input: {
        categoryId: null,
      },
    },
  });
  const [visible, setVisible] = useState(false);
  const handlePress = () => {
     setShowFilter(false);
  };
  const handleApply = () => {
    // Here you would likely apply the selected filters
    setVariables({
      input: {
        minPrice: values[0],
        maxPrice: values[1],
        categories: category1,
        attributes: attributes,
        brands:brands,
        parentCategory:parentCategory || null,
      },
    });
    // Optionally, you can close the modal after applying the filters
   // setVisible(false);
   setShowFilter(false);
  };
  const handleReset = () => {
    setValues([0, 1000]);
    setCategory1([]);  // Reset selected categories
    setBrands([]);
    setAttributes([]);  // Reset attributes
    setParentCategory();
   // setSelectedIndex(null);  // Reset color selection
  };
  const [category, setCategory] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [selectedIndex, setSelctedIndex] = useState(null);
  const [color, setColor] = useState(true);
const [expanded, setExpanded] = useState(null);
  // filtration variables
  const [values, setValues] = useState([variables?.input?.minPrice ?? 0,variables?.input?.maxPrice ?? 1000]);
  const [category1, setCategory1] = useState(variables?.input?.categories || []);
  const [attributes, setAttributes] = useState([]);
  const [parentCategory,setParentCategory] =useState(variables?.input?.parentCategory || "");
  const[brands,setBrands]=useState(variables?.input?.brands|| [])
  const[brand,setBrand]=useState(true);
//const[brands,setBrands]=useState(variables?.input?.brands|| [])
  //const [variables, setVariables] = useState({});
  useEffect(() => {
    // Show the modal when the component is mounted
    setVisible(true);
  }, []);

  const {loading: attributesLoading, data: attributesData} = useQuery(GET_ATTRIBUTES_WITH_CATEGORY, {
    variables: {
      input: {
        categoryId: null,
      },
    },
  });
  //const colorAttributes = attributesData?.getVariants?.variants?.filter(item => item.colorCode);

 
  const multiSliderValuesChange = values => {
    setValues(values);
  };
  useEffect(() => {
    console.log(attributes);
    setVariables({
      input: {
        minPrice: values[0],
        maxPrice: values[1],
        categories: category1,
        attributes: attributes,
        brands:brands,
       // parentCategory:parentCategory || null,
      },
    });
  }, [values, category1, attributes,brands,parentCategory]);
const handleAttributeSelection = (attributeId, valueId) => {
  setAttributes(prevAttributes => {
    const existingIndex = prevAttributes.findIndex(attr => attr.id === attributeId);

    if (existingIndex !== -1) {
      const updatedAttributes = [...prevAttributes];
      const valueIndex = updatedAttributes[existingIndex].values.indexOf(valueId);

      if (valueIndex !== -1) {
        // Remove value if already selected
        updatedAttributes[existingIndex].values.splice(valueIndex, 1);
        if (updatedAttributes[existingIndex].values.length === 0) {
          updatedAttributes.splice(existingIndex, 1);
        }
      } else {
        // Add new value
        updatedAttributes[existingIndex].values.push(valueId);
      }
      return updatedAttributes;
    } else {
      return [...prevAttributes, { id: attributeId, values: [valueId] }];
    }
  });
};
{/*const colorss = [
    {
      id: 1,
      colorCode: 'blue',
      attributeId: '65cfac9e53fdc10fc98f8229',
      attributeValueId: '65cfacc053fdc10fc98f8235',
    },
    {
      id: 1,
      colorCode: 'green',
      attributeId: '65cfac9e53fdc10fc98f8229',
      attributeValueId: '65cfacc053fdc10fc98f8235',
    },
    {
      id: 1,
      colorCode: '#000',
      attributeId: '65cfac9e53fdc10fc98f8229',
      attributeValueId: '65cfacc053fdc10fc98f8235',
    },
    {
      id: 1,
      colorCode: 'yellow',
      attributeId: '65cfac9e53fdc10fc98f8229',
      attributeValueId: '65cfacc053fdc10fc98f8235',
    },
  ];*/}
  const handleSelection = (index, item) => {
    setSelctedIndex(index);
    //console.log(item, '&&&&');
    //setAttributes([{id: item.attributeId, values: [item.attributeValueId]}]);
    setAttributes(prevAttributes => {
      const existingIndex = prevAttributes.findIndex(attr => attr.id === item.attributeId);
      if (existingIndex !== -1) {
        // Update existing attribute
        const updatedAttributes = [...prevAttributes];
        updatedAttributes[existingIndex].values = [item.attributeValueId];
        return updatedAttributes;
      } else {
        // Add new attribute
        return [...prevAttributes, {id: item.attributeId, values: [item.attributeValueId]}];
      }
    });
  };
 {/* const handleCategory = item => {
    // Check if the category is already selected
    const index = category1.indexOf(item._id);
    if (index !== -1) {
      // If selected, remove it from the selected categories
      setCategory1(prevCategory =>
        prevCategory.filter(catId => catId !== item._id),
      );
    } else {
      // If not selected, add it to the selected categories
      setCategory1(prevCategory => [...prevCategory, item._id]);
    }
  };*/}
 const handleCategory = item => {
   setCategory1(prevCategory =>
     prevCategory.includes(item._id)
       ? prevCategory.filter(catId => catId !== item._id) // Remove if exists
       : [...prevCategory, item._id] // Add if not exists
   );
    setCategory(true);
 };
const handleBrand = item => {
  setBrands(prevBrands =>
    prevBrands.includes(item._id)
      ? prevBrands.filter(brandId => brandId !== item._id) // Remove if exists
      : [...prevBrands, item._id] // Add if not exists
  );
};
const [selectedFilters, setSelectedFilters] = useState({});

const handleSelect = (attriId, valueId) => {
  setSelectedFilters((prev) => ({
    ...prev,
    [attriId]: prev[attriId] === valueId ? null : valueId,
  }));
};

  return (
    <View style={{flex: 1}}>
      {/*<Button title="test" onPress={handlePress} />*/}
      <Modal
        isVisible={showFilter}
        onBackButtonPress={handlePress}
        onBackdropPress={handlePress}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            height: height * 0.8,
            paddingVertical: 15,
          }}>
          <View style={[styles.header]}>
            <Text style={styles.resetTxt}>Filter</Text>
            <CloseCircle
              size="30"
              color="#9E9E9E"
              variant="Bold"
              onPress={handlePress}
            />
          </View>
          <ScrollView>
          { parentCategory && brandsData?.getBrandDetailsWithCategoryInMobile?.records.length > 0 &&(
            <List.Accordion
                        title="Brands"
                        style={{backgroundColor: '#fff'}}
                       expanded={brands.length > 0}
                                      onPress={() => setBrands([...brands])}
                        titleStyle={styles.title}
                        right={props => (
                          <Icon
                            name={category ? 'chevron-up' : 'chevron-down'}
                            size={24}
                            color={'#9E9E9E'}
                            style={{marginRight: -12}}
                          />
                        )}>
                        <Divider />
                          <View style={styles.catContainer}>
                                        {brandsData?.getBrandDetailsWithCategoryInMobile?.records?.map((brand, index) => (
                                          <TouchableOpacity
                                            key={index}
                                            style={styles.catItem}
                                           onPress={() => handleBrand(brand)}>
                                            <Text style={styles.catTxt}>{brand.brandName}</Text>
                                            <View>
                                                {brands.includes(brand._id) ? (
                                                <Icon
                                                  name={'checkbox-marked'}
                                                  size={24}
                                                  color={'#191919'}
                                                />
                                              ) : (
                                                <Icon
                                                  name={'checkbox-blank-outline'}
                                                  size={24}
                                                  color={'#9E9E9E'}
                                                />
                                              )}
                                            </View>
                                          </TouchableOpacity>
                                        ))}
                                      </View>
                                    </List.Accordion>
)}
{!parentCategory &&(brands.length >= 0 ||  category1.length === 0) && (
            <List.Accordion
              title="Category"
              style={{backgroundColor: '#fff'}}
              expanded={category ||category1.length > 0}
              onPress={() => setCategory(!category)}
              titleStyle={styles.title}
              right={props => (
                <Icon
                  name={category ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={'#9E9E9E'}
                  style={{marginRight: -12}}
                />
              )}>
              <Divider />
              <View style={styles.catContainer}>
                {data?.getActiveChildCategoriesInMobile?.records?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.catItem}
                    onPress={() => handleCategory(item)}>
                    <Text style={styles.catTxt}>{item.categoryName}</Text>
                    <View>

                     {category1.includes(item._id) ? (
                        <Icon
                          name={'checkbox-marked'}
                          size={24}
                          color={'#191919'}
                        />
                      ) : (
                        <Icon
                          name={'checkbox-blank-outline'}
                          size={24}
                          color={'#9E9E9E'}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </List.Accordion>
)}
            <List.Accordion
              title="Price"
              style={{backgroundColor: '#fff'}}
              expanded={priceExpanded}
              onPress={() => setPriceExpanded(!priceExpanded)}
              titleStyle={styles.title}
              right={props => (
                <Icon
                  name={priceExpanded ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={'#9E9E9E'}
                  style={{marginRight: -12}}
                />
              )}>
              <Divider />
              <View style={{marginHorizontal: 40}}>
                <MultiSlider
                  values={values}
                  sliderLength={width - 80}
                  onValuesChange={multiSliderValuesChange}
                  min={0}
                  max={1000}
                  step={1}
                  allowOverlap={false}
                  snapped={true}
                  containerStyle={{marginVertical: 10}}
                  selectedStyle={{
                    backgroundColor: '#D9D9D9',
                  }}
                  unselectedStyle={{
                    backgroundColor: '#B1B1B1',
                  }}
                  markerStyle={{backgroundColor: 'red', marginTop: 4}}
                  trackStyle={{height: 5}}
                />

                <Text style={styles.rangeTxt}>
                  Price : OMR {values[0]} - {values[1]}
                </Text>
              </View>
            </List.Accordion>
           {/*} {attributes?.length > 0 && (
            <List.Accordion
              title="Color"
              style={{backgroundColor: '#fff'}}
              expanded={color}
              onPress={() => setColor(!color)}
              titleStyle={styles.title}
              right={props => (
                <Icon
                  name={color ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={'#9E9E9E'}
                  style={{marginRight: -12}}
                />
              )}>
              <Divider />
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  marginVertical: 20,
                  paddingLeft: 12,
                }}>
                {colorAttributes.map((color, index) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.memoryContainer,
                        {
                          backgroundColor: color.colorCode,
                          borderWidth: 6,
                          borderColor: '#F5F5F5',
                          width: 47,
                          height: 47,
                          borderRadius: 24,
                        },
                      ]}
                      key={index}
                      onPress={() => handleSelection(index, color)}>
                      {selectedIndex === index && (
                        <Image
                          source={require('../../assets/images/tick.png')}
                          style={{width: 14, height: 14, alignSelf: 'center'}}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </List.Accordion>
            )}
            */}

           {/*}  {attributesData?.getAttributesDetailsWithCategoryInMobile?.record?.attributes.map((attri) => (
               <View key={attri._id}>
                 {attri.attributeType === "COLOR" ? (
                   <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 10 }}>
                     {attri.attributeValues.map((item) => (
                       <TouchableOpacity
                         key={item._id}
                         onPress={() => handleSelect(attri._id, item._id)}
                         style={{
                           width: 38,
                           height: 38,
                           borderRadius: 19,
                           backgroundColor: item.colorCode,
                           margin: 5,
                           borderWidth: selectedFilters[attri._id] === item._id ? 2 : 0,
                           borderColor: "black",
                         }}
                       />
                     ))}
                   </View>
                 ) : (
                   // Normal Attributes
                   <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 10 }}>
                     {attri.attributeValues.map((item) => (
                       <TouchableOpacity
                         key={item._id}
                         onPress={() => handleSelect(attri._id, item._id)}
                         style={{
                           padding: 10,
                           borderWidth: 1,
                           borderColor: selectedFilters[attri._id] === item._id ? "red" : "gray",
                           margin: 5,
                         }}
                       >
                         <Text>{item.value}</Text>
                       </TouchableOpacity>
                     ))}
                   </View>
                 )}
               </View>
             ))}

*/}
          </ScrollView>
          <View style={styles.shadowStyle} />
          <View style={[styles.footer]}>
            <View style={styles.resetContainer}>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.filterTxt}>Reset</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.applyContainer,
                {backgroundColor: colors.primary},
              ]}>
                
              <Text style={styles.applyTxt}>
                {itemscount} items
              
              </Text>
             
              <TouchableOpacity onPress={handleApply}>
                <Text style={styles.applyTxt}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
     
   
        
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  footer: {flexDirection: 'row', paddingHorizontal: 12},
  applyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 15,
  },
  resetContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginRight: 10,
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding:5
  },
  catContainer: {paddingHorizontal: 40, marginTop: 10},
  catItem: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContainer: {
    borderWidth: 2,
    margin: 5,
    padding: 8,
    borderColor: '#E6E6E6',
    paddingBottom: 10,
    height:300
  },
  memoryContainer: {
    width: width * 0.17,
    paddingVertical: 10,
    marginRight: 15,
    borderRadius: 10,
  },
  catTxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#333333',
  },
  applyTxt: {fontFamily: 'Poppins-Medium', fontSize: 14, color: '#fff'},
  filterTxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#474747',
  },
  resetTxt: {fontFamily: 'Poppins-Medium', fontSize: 16, color: '#000'},
  title: {
    color: '#333333',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: -3,
  },
  rangeTxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#696363',
    marginBottom: 20,
  },
  shadowStyle: {
    height: 0.5,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  productPrice: {
    fontSize: 14,
    color: '#007BFF',
  },
  container1: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:"white"
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor:"#fff"
  },
  txt: {
    marginLeft: 5,
    fontSize: 12,
    color: '#474747',
    fontFamily: 'Poppins-Medium',
  },
});

export default FilterProducts;
