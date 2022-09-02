import React, { Component } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  Platform,
  RefreshControl,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Identifiable } from "data-types";
import ViewComponent from "./ViewComponent";

interface ListComponentProps<T> {
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isLoading: boolean;
  numColumns?: number;
  horizontal?: boolean;
  pagingEnabled?: boolean;
  itemSeparatorSize?: number;
  itemSeparatorStyle?: StyleProp<ViewStyle>;
  removeClippedSubviews?: boolean;
  data: T[];
  renderHeader?: () => JSX.Element | null;
  renderItem: (item: T, index: number) => JSX.Element | null;
  renderSeparator?: (
    highlighted: boolean,
    leadingItem: T
  ) => JSX.Element | null;
  renderFooter?: () => JSX.Element | null;
  renderEmpty?: () => JSX.Element | null;
  handleOnRefresh?: () => void;
  onEndReachedThreshold?: number;
  handleEndScroll?: () => void;
}

interface ListComponentState<T> {
  ref?: FlatList<T>;
}

class ListComponent<T extends Identifiable> extends Component<
  ListComponentProps<T>,
  ListComponentState<T>
> {
  static defaultProps = {
    isLoading: false,
    scrollEnabled: true,
  };

  render() {
    const {
      isLoading,
      style,
      onLayout,
      contentContainerStyle,
      numColumns,
      horizontal,
      pagingEnabled,
      removeClippedSubviews,
      data,
      renderHeader,
      renderFooter,
      renderEmpty,
      handleOnRefresh,
      onEndReachedThreshold,
      handleEndScroll,
    } = this.props;

    return (
      <FlatList
        style={style}
        ref={this.ref}
        onLayout={onLayout}
        contentContainerStyle={contentContainerStyle}
        numColumns={numColumns}
        horizontal={horizontal}
        pagingEnabled={pagingEnabled}
        removeClippedSubviews={
          Platform.OS == "android" ? removeClippedSubviews : false
        }
        data={data}
        ListHeaderComponent={renderHeader}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          handleOnRefresh ? (
            <RefreshControl
              refreshing={isLoading}
              tintColor={"red"}
              onRefresh={handleOnRefresh}
            />
          ) : undefined
        }
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={handleEndScroll}
      />
    );
  }

  private ref = (ref: FlatList<T>) => {
    this.setState({ ref });
  };

  private keyExtractor = (item: T) => {
    return item.id.toString();
  };

  private renderItem = (info: { item: T; index: number }) => {
    const { renderItem } = this.props;
    const { index, item } = info;

    return renderItem(item, index);
  };

  private renderSeparator = (info: {
    highlighted: boolean;
    leadingItem: T;
  }) => {
    const { horizontal, itemSeparatorSize, renderSeparator } = this.props;

    if (renderSeparator !== undefined) {
      return renderSeparator(info.highlighted, info.leadingItem);
    }
    return (
      <ViewComponent
        style={
          horizontal
            ? { width: itemSeparatorSize }
            : { height: itemSeparatorSize }
        }
      />
    );
  };

  scrollToOffset = (params: { animated?: boolean; offset: number }) => {
    const { ref } = this.state;

    ref?.scrollToOffset(params);
  };

  scrollToIndex = (params: {
    animated?: boolean;
    index: number;
    viewOffset?: number;
    viewPosition?: number;
  }) => {
    const { ref } = this.state;

    ref?.scrollToIndex(params);
  };
}

export default ListComponent;
