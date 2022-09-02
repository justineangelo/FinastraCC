interface Identifiable {
  id: number | string;
}

interface User extends Identifiable {
  name?: string;
  phone?: string;
  email?: string;
}

interface Student extends User {
  courses?: Course[];
  currencyExchange?: CurrencyExchange;
}

interface Course extends Identifiable {
  user_id?: number;
  course_selection?: string;
  course_name?: string;
  semester?: string;
  semester_fee?: number;
}

interface Currency {
  symbol?: string;
  name?: string;
  symbol_native?: string;
  decimal_digits?: number;
  rounding?: number;
  code?: string;
  name_plural?: string;
}

interface CurrencyExchange {
  target_symbol?: string;
  target_code?: string;
  conversion_rate?: number;
}

export { Identifiable, User, Student, Course, Currency, CurrencyExchange };
