import React, { Component, ReactNode } from "react";
import { StyleSheet, Alert } from "react-native";

import { BaseView, ListComponent, Loader, ViewComponent } from "components";
import {
  CurrencyDropdown,
  SearchField,
  SortDropdown,
  SortType,
  StudentCard,
} from "./components";
import { User, Student, Course, Currency, CurrencyExchange } from "data-types";
import { ExchangeService, PrimaryService } from "api/services";
import { removeDuplicates, seasonWeight } from "utils";
import colors from "assets/colors";

interface HomeScreenState {
  isLoading: boolean;
  rawStudents: Student[];
  students: Student[];
  searchValue?: string;
  currencyFocus: boolean;
  currencies: Currency[];
  selectedCurrency?: Currency;
  currencyExchange?: CurrencyExchange;
  sortFocus: boolean;
  sorts: { value: SortType }[];
  selectedSort: SortType;
}

class HomeScreen extends Component<unknown, HomeScreenState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      isLoading: false,
      rawStudents: [],
      students: [],
      currencyFocus: false,
      currencies: [],
      sortFocus: false,
      sorts: [
        { value: "None" },
        { value: "Name Ascending" },
        { value: "Name Descending" },
        { value: "Phone Ascending" },
        { value: "Phone Descending" },
        { value: "Email Ascending" },
        { value: "Email Descending" },
      ],
      selectedSort: "None",
    };
  }

  private usersService?: PrimaryService<User[]>;
  private coursesService?: PrimaryService<Course[]>;
  private currencyService?: PrimaryService<{ [k: string]: Currency }>;
  private exchangeService?: ExchangeService<CurrencyExchange>;

  componentDidMount() {
    this.loadResources();
  }

  render(): ReactNode {
    const {
      isLoading,
      students,
      searchValue,
      currencyFocus,
      currencies,
      selectedCurrency,
      sortFocus,
      sorts,
      selectedSort,
    } = this.state;

    return (
      <ViewComponent style={styles.container}>
        <SearchField
          style={styles.search}
          value={searchValue}
          onChangeText={this.searchOnChangeText}
        />
        <CurrencyDropdown
          style={styles.currency}
          data={currencies}
          selectedCurrency={selectedCurrency}
          isFocus={currencyFocus}
          onFocus={this.currencyOnFocus}
          onSelect={this.currencyOnSelect}
        />
        <SortDropdown
          style={styles.sort}
          data={sorts}
          selectedSort={selectedSort}
          isFocus={sortFocus}
          onFocus={this.sorOnFocus}
          onSelect={this.sortOnSelect}
        />
        <BaseView style={styles.container}>
          <ListComponent
            contentContainerStyle={{ paddingTop: 10 }}
            isLoading={isLoading}
            data={students}
            itemSeparatorSize={8}
            renderItem={this.renderItem}
            renderEmpty={this.renderEmpty}
            handleOnRefresh={this.handleOnRefresh}
          />
        </BaseView>
      </ViewComponent>
    );
  }

  private renderItem = (item: Student) => {
    return <StudentCard style={styles.card} data={item} />;
  };

  private renderEmpty = () => {
    const { isLoading } = this.state;

    return isLoading ? (
      <Loader />
    ) : (
      <StudentCard style={[styles.card, { alignItems: "center" }]} />
    );
  };

  private handleOnRefresh = () => {
    this.loadResources();
  };

  private searchOnChangeText = (value: string) => {
    const { rawStudents, selectedSort } = this.state;

    this.setState({
      searchValue: value,
      students: sortStudents(filterStudents(rawStudents, value), selectedSort),
    });
  };

  private currencyOnFocus = (focus: boolean) => {
    this.setState({ currencyFocus: focus });
  };

  private currencyOnSelect = (currency: Currency) => {
    const { selectedCurrency } = this.state;

    this.setState({ selectedCurrency: currency }, () =>
      this.calculateCurrencyExchange(currency, () => {
        this.setState({ selectedCurrency }); //revert selectedCurrency on error
      })
    );
  };

  private sorOnFocus = (focus: boolean) => {
    this.setState({ sortFocus: focus });
  };

  private sortOnSelect = (sort: SortType) => {
    const { rawStudents, searchValue } = this.state;

    this.setState({
      students: sortStudents(filterStudents(rawStudents, searchValue), sort),
      selectedSort: sort,
    });
  };

  private loadResources() {
    this.usersService?.cancel();
    this.coursesService?.cancel();
    this.currencyService?.cancel();
    this.usersService = new PrimaryService();
    this.coursesService = new PrimaryService();
    this.currencyService = new PrimaryService();

    this.setState({ isLoading: true });
    Promise.all([
      this.usersService.getUsers().execute(),
      this.coursesService.getCourses().execute(),
      this.currencyService.getCurrencies().execute(),
    ])
      .then((response) => {
        const {
          searchValue,
          selectedCurrency,
          currencyExchange,
          selectedSort,
        } = this.state;
        const initial: Student[] = [];
        const rawStudents = response[0].reduce((students, user) => {
          return [
            ...students,
            {
              ...user,
              courses: removeDuplicates(
                response[1].filter((course) => course.user_id == user.id),
                ({ course_name, course_selection, semester }) => [
                  course_name,
                  course_selection,
                  semester,
                ]
              ).sort(
                (aCourse, bCourse) =>
                  seasonWeight(aCourse.semester) -
                  seasonWeight(bCourse.semester)
              ),
              currencyExchange,
            },
          ];
        }, initial);

        this.setState({
          isLoading: false,
          rawStudents,
          students: sortStudents(
            filterStudents(rawStudents, searchValue),
            selectedSort
          ),
          currencies: Object.values(response[2]),
          ...(!selectedCurrency
            ? { selectedCurrency: response[2]["USD"] }
            : null),
        });
      })
      .catch((error) => {
        //-1 is cancelled ignore
        if (error.code != -1) {
          Alert.alert("Error", error.message);
        }
        this.setState({ isLoading: false });
      });
  }

  private calculateCurrencyExchange = (
    currency: Currency,
    onError?: () => void
  ) => {
    if (!currency.code) {
      return;
    }
    this.exchangeService?.cancel();
    this.exchangeService = new ExchangeService();

    this.setState({ isLoading: true });
    this.exchangeService
      .getRateForCurrency(currency.code)
      .execute()
      .then((currencyExchange) => {
        const { searchValue, rawStudents, selectedSort } = this.state;
        const uCurrentExchangeRate = {
          ...currencyExchange,
          target_symbol: currency.symbol,
        };
        const uRawStudents = rawStudents.map((student) => ({
          ...student,
          currencyExchange: uCurrentExchangeRate,
        }));

        this.setState({
          isLoading: false,
          rawStudents: uRawStudents,
          students: sortStudents(
            filterStudents(uRawStudents, searchValue),
            selectedSort
          ),
          currencyExchange: uCurrentExchangeRate,
        });
      })
      .catch((error) => {
        if (error.code != -1) {
          Alert.alert(
            "Error",
            error.message == "unsupported-code"
              ? "Unsupported currency type"
              : error.message,
            [{ text: "OK", onPress: () => onError && onError() }]
          );
        }
        this.setState({ isLoading: false });
      });
  };
}

const filterStudents = (students: Student[], search?: string) => {
  if (search) {
    const searchValue = search.toLowerCase();

    return students.filter(
      ({ name, phone, email }) =>
        name?.toLowerCase().includes(searchValue) ||
        phone?.toLowerCase().includes(searchValue) ||
        email?.toLowerCase().includes(searchValue)
    );
  }
  return students;
};

const sortStudents = (students: Student[], sort: SortType) => {
  switch (sort) {
    case "None":
      return students;
    case "Name Ascending":
      return [...students].sort((aStudent, bStudent) =>
        compareString(aStudent.name, bStudent.name, false)
      );
    case "Name Descending":
      return [...students].sort((aStudent, bStudent) =>
        compareString(aStudent.name, bStudent.name, true)
      );
    case "Email Ascending":
      return [...students].sort((aStudent, bStudent) =>
        compareString(aStudent.email, bStudent.email, false)
      );
    case "Email Descending":
      return [...students].sort((aStudent, bStudent) =>
        compareString(aStudent.email, bStudent.email, true)
      );
    case "Phone Ascending":
      return [...students].sort((aStudent, bStudent) =>
        compareString(aStudent.phone, bStudent.phone, false)
      );
    case "Phone Descending":
      return [...students].sort((aStudent, bStudent) =>
        compareString(aStudent.phone, bStudent.phone, true)
      );
  }
};

const compareString = (a?: string, b?: string, reverse = false) => {
  if (a && b) {
    if (reverse) {
      return b.localeCompare(a);
    }
    return a.localeCompare(b);
  }
  return 0;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  search: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  currency: {
    marginHorizontal: 16,
  },
  sort: {
    marginHorizontal: 16,
  },
  card: {
    marginHorizontal: 16,
  },
});

export default HomeScreen;
