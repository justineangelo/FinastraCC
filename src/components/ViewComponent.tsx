import React, { Component, PropsWithChildren } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

interface ViewComponentProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle> | undefined;
  onPress?: () => void;
}

class ViewComponent extends Component<ViewComponentProps> {
  render(): React.ReactNode {
    const { style, children, onPress } = this.props;

    if (onPress) {
      return (
        <TouchableOpacity style={style} onPress={onPress}>
          {children}
        </TouchableOpacity>
      );
    }
    return this.renderView();
  }

  private renderView() {
    const { style, children } = this.props;

    return <View style={style}>{children}</View>;
  }
}

export default ViewComponent;
