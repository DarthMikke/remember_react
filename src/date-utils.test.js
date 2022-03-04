import {parseDate} from "./date-utils";

test("Parsing 01.02.2034 11.10", () => {
  expect(parseDate("01.02.2034 11.10")).toStrictEqual(new Date(2034, 1, 1, 11, 10));
  //expect(parseDate("01.02.2034 11.10").toJSON()).toBe("2034-02-01T10:10:00.000Z");
})
test("Parsing 01.02.2034 1.10", () => {
  expect(parseDate("01.02.2034 1.10")).toStrictEqual(new Date(2034, 1, 1, 1, 10));
  //expect(parseDate("01.02.2034 1.10").toJSON()).toBe("2034-02-01T00:10:00.000Z");
})
test("Parsing 02.02.2022 9.15", () => {
  expect(parseDate("02.02.2022 9.15")).toStrictEqual(new Date(2022, 1, 2, 9, 15));
  //expect(parseDate("02.02.2022 9.15").toJSON()).toBe("2022-02-02T08:15:00.000Z");
})
