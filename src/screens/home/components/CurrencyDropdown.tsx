import React, { Component } from "react";
import { StyleProp, ViewStyle, StyleSheet, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import colors from "assets/colors";
import { Currency } from "data-types";
import { ViewComponent } from "components";

interface CurrencyDropdownProps {
  style?: StyleProp<ViewStyle>;
  data: Currency[];
  selectedCurrency?: Currency;
  isFocus: boolean;
  onFocus?: (focus: boolean) => void;
  onSelect?: (currency: Currency) => void;
}

class CurrencyDropdown extends Component<CurrencyDropdownProps> {
  constructor(props: CurrencyDropdownProps) {
    super(props);

    this.state = {
      data: [],
    };
  }

  render(): React.ReactNode {
    const { style, data, selectedCurrency, isFocus, onFocus, onSelect } =
      this.props;

    return (
      <ViewComponent style={[styles.container, style]}>
        <Text style={styles.title}>Currency Type: </Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={data}
          maxHeight={300}
          labelField="code"
          valueField="code"
          search
          placeholder={!isFocus ? "Select currency" : "..."}
          searchPlaceholder="Search..."
          value={selectedCurrency?.code}
          onFocus={() => onFocus && onFocus(true)}
          onBlur={() => onFocus && onFocus(false)}
          onChange={(currency: Currency) => {
            onSelect && onSelect(currency);
            onFocus && onFocus(false);
          }}
          renderItem={this.renderItem}
        />
      </ViewComponent>
    );
  }

  private renderItem = (item: Currency, selected?: boolean) => {
    return (
      <ViewComponent
        style={[styles.item, selected ? styles.itemSelected : null]}
      >
        <Text style={styles.text}>
          {item.code} - {item.name}
        </Text>
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

export default CurrencyDropdown;
