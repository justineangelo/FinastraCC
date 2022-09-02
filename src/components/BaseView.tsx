import React, { Component, PropsWithChildren } from "react";
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
} from "react-native";
import ViewComponent from "./ViewComponent";

interface BaseViewProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  useSafeArea?: boolean;
  headerContent?: JSX.Element;
  onLayout?: (layoutEvent: LayoutChangeEvent) => void;
}

class BaseView extends Component<BaseViewProps> {
  static defaultProps = {
    useSafeArea: true,
  };

  render() {
    const { style, useSafeArea, headerContent, children } = this.props;

    return (
      <ViewComponent style={[styles.container, style]}>
        {useSafeArea ? (
          <SafeAreaView style={{ flex: 1 }}>
            {headerContent}
            {children}
          </SafeAreaView>
        ) : (
          <>
            {headerContent}
            {children}
          </>
        )}
      </ViewComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default BaseView;
