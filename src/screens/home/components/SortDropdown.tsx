import React, { Component } from "react";
import { StyleProp, ViewStyle, StyleSheet, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import colors from "assets/colors";
import { ViewComponent } from "components";

type SortType =
  | "None"
  | "Name Ascending"
  | "Name Descending"
  | "Phone Ascending"
  | "Phone Descending"
  | "Email Ascending"
  | "Email Descending";

interface SortDropdownProps {
  style?: StyleProp<ViewStyle>;
  data: { value: SortType }[];
  selectedSort?: SortType;
  isFocus: boolean;
  onFocus?: (focus: boolean) => void;
  onSelect?: (sort: SortType) => void;
}

class SortDropdown extends Component<SortDropdownProps> {
  constructor(props: SortDropdownProps) {
    super(props);

    this.state = {
      data: [],
    };
  }

  render(): React.ReactNode {
    const { style, data, selectedSort, isFocus, onFocus, onSelect } =
      this.props;

    return (
      <ViewComponent style={[styles.container, style]}>
        <Text style={styles.title}>Sort By: </Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={data}
          maxHeight={300}
          labelField="value"
          valueField="value"
          placeholder={!isFocus ? "Select currency" : "..."}
          value={selectedSort}
          onFocus={() => onFocus && onFocus(true)}
          onBlur={() => onFocus && onFocus(false)}
          onChange={(data: { value: SortType }) => {
            onSelect && onSelect(data.value);
            onFocus && onFocus(false);
          }}
          renderItem={this.renderItem}
        />
      </ViewComponent>
    );
  }

  private renderItem = (item: { value: SortType }, selected?: boolean) => {
    return (
      <ViewComponent
        style={[styles.item, selected ? styles.itemSelected : null]}
      >
        <Text style={styles.text}>{item.value}</Text>
      </ViewComponent>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },
  title: { fontSize: 14, fontWeight: "bold" },
  text: {
    fontSize: 14,
  },
  dropdown: {
    flex: 1,
    borderColor: colors.border.main,
    borderWidth: 0.3,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  inputSearchStyle: {
    height: 32,
    fontSize: 14,
  },
  item: {
    height: 32,
    padding: 8,
    justifyContent: "center",
  },
  itemSelected: {
    backgroundColor: colors.background.secondary,
  },
});

export { SortType };
export default SortDropdown;
