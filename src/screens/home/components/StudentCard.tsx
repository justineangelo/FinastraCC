import React, { Component, PropsWithChildren } from "react";
import { StyleProp, StyleSheet, ViewStyle, Text } from "react-native";
import colors from "assets/colors";
import { Student } from "data-types";
import { ViewComponent } from "components";
import CourseCard from "./CourseCard";

interface StudentCardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  data?: Student;
}

class StudentCard extends Component<StudentCardProps> {
  render(): React.ReactNode {
    const { style, data } = this.props;
    let currentSemester = "";

    return (
      <ViewComponent style={[styles.container, style]}>
        {data ? (
          <ViewComponent style={styles.containerColumn}>
            <ViewComponent style={styles.containerColumn}>
              <ViewComponent style={styles.containerRow}>
                <Text style={styles.text}>{data?.name}</Text>
                <Text style={styles.text}>{data?.email}</Text>
              </ViewComponent>
              <Text style={styles.text}>{data?.phone}</Text>
            </ViewComponent>
            {data?.courses && data.courses.length > 0 ? (
              data.courses.map((course) => {
                const showSemester = currentSemester != course.semester;

                currentSemester = course.semester ?? "";
                return (
                  <ViewComponent key={course.id}>
                    {showSemester ? (
                      <Text style={[styles.title, { marginTop: 16 }]}>
                        Semester:{" "}
                        <Text style={styles.text}>{course?.semester}</Text>
                      </Text>
                    ) : null}
                    <CourseCard
                      style={[{ marginTop: 2 }]}
                      data={course}
                      currencyExchange={data.currencyExchange}
                    />
                  </ViewComponent>
                );
              })
            ) : (
              <CourseCard style={[{ marginTop: 4, alignItems: "center" }]} />
            )}
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
  text: { flex: 1, fontSize: 14, lineHeight: 21, fontWeight: "500" },
});

export default StudentCard;
