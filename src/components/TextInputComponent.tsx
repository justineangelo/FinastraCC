import React, { Component } from "react";
import { TextInput, StyleSheet, StyleProp, TextStyle } from "react-native";
import colors from "assets/colors";

interface TextInputComponentProps {
  style?: StyleProp<TextStyle>;
  placeholder?: string;
  placeholderTextColor: string;
  clearButtonMode?: "never" | "while-editing" | "unless-editing" | "always";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  value?: string;
  onChangeText?: (text: string) => void;
  onSearchPress?: () => void;
}

class TextInputComponent extends Component<TextInputComponentProps> {
  static defaultProps = {
    placeholderTextColor: colors.text.secondary,
  };

  render(): React.ReactNode {
    const {
      style,
      placeholder,
      placeholderTextColor,
      clearButtonMode,
      autoCapitalize,
      value,
      onChangeText,
      onSearchPress,
    } = this.props;

    return (
      <TextInput
        style={[styles.container, style]}
        placeholder={placeholder}
        clearButtonMode={clearButtonMode}
        placeholderTextColor={placeholderTextColor}
        value={value}
        autoCapitalize={autoCapitalize}
        onChangeText={onChangeText}
        onSubmitEditing={onSearchPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    color: colors.text.main,
  },
});

export default TextInputComponent;
