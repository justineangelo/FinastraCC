import React, { Component } from "react";
import { StyleSheet, StyleProp, ViewStyle, Text } from "react-native";
import { ViewComponent } from "components";
import { Course, CurrencyExchange } from "data-types";
import colors from "assets/colors";

interface CourseCardProps {
  style?: StyleProp<ViewStyle>;
  data?: Course;
  currencyExchange?: CurrencyExchange;
}

class CourseCard extends Component<CourseCardProps> {
  render(): React.ReactNode {
    const { style, data, currencyExchange } = this.props;

    return (
      <ViewComponent style={[styles.container, style]}>
        {data ? (
          <ViewComponent style={styles.containerRow}>
            <ViewComponent style={styles.containerColumn}>
              <Text style={styles.title}>Course:</Text>
              <Text style={styles.text}>
                {data?.course_name} ({data?.course_selection})
              </Text>
            </ViewComponent>
            <ViewComponent style={styles.containerColumn}>
              <Text style={styles.title}>Semester Fee:</Text>
              <Text style={styles.text}>{`${
                currencyExchange?.target_symbol ?? "$"
              } ${
                data.semester_fee
                  ? (
                      data.semester_fee *
                      (currencyExchange?.conversion_rate ?? 1)
                    ).toFixed(2)
                  : 0
              }`}</Text>
            </ViewComponent>
          </ViewComponent>
        ) : (
          <Text style={styles.title}>No data found</Text>
        )}
      </ViewComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.main,
    padding: 8,
    borderColor: colors.border.main,
    borderWidth: 0.3,
    borderRadius: 8,
  },
  containerRow: { flex: 1, flexDirection: "row" },
  containerColumn: { flex: 1 },
  title: { fontSize: 14, fontWeight: "bold" },
  text: { flex: 1, fontSize: 14, fontWeight: "500" },
});

export default CourseCard;
