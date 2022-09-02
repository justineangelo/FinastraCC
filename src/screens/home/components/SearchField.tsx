import React, { Component } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { TextInputComponent, ViewComponent } from "components";
import colors from "assets/colors";

interface SearchFieldProps {
  style?: StyleProp<ViewStyle>;
  value?: string;
  onChangeText?: (text: string) => void;
}

class SearchField extends Component<SearchFieldProps> {
  render(): React.ReactNode {
    const { style, value, onChangeText } = this.props;

    return (
      <ViewComponent style={[styles.container, style]}>
        <TextInputComponent
          style={styles.searchField}
          placeholder={"Search name, phone, email"}
          autoCapitalize={"none"}
          clearButtonMode={"while-editing"}
          value={value}
          onChangeText={onChangeText}
        />
      </ViewComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderColor: colors.border.main,
    borderWidth: 0.3,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchField: {
    flex: 1,
  },
});

export default SearchField;
