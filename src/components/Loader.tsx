import React, { Component } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import ViewComponent from "./ViewComponent";

interface LoaderProps {
  isLoading: boolean;
}

class Loader extends Component<LoaderProps> {
  static defaultProps = {
    isLoading: true,
  };

  render() {
    const { isLoading } = this.props;

    return (
      <ViewComponent style={[styles.container]}>
        <ActivityIndicator animating={isLoading} />
      </ViewComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default Loader;
