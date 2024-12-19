const options: Intl.DateTimeFormatOptions = {
  weekday: "long", // "long" is a specific string literal
  year: "numeric", // "numeric" is a specific string literal
  month: "2-digit", // "2-digit" is a specific string literal
  day: "2-digit", // "2-digit" is a specific string literal
  hour: "2-digit", // "2-digit" is a specific string literal
  minute: "2-digit", // "2-digit" is a specific string literal
  timeZone: "Asia/Ho_Chi_Minh", // Valid timezone string
  hour12: false, // Boolean
};

export const formatter = new Intl.DateTimeFormat("en-US", options);

export function FormatDate(dateString: string) {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return formatter.format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
}

export const Refreshed = (searchParams: URLSearchParams, router: any) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("refreshed", Date.now().toString());
  router.replace(`?${params.toString()}`);
};

export function ConvertToNumber(text: string): number {
  const cleanedText = text.replace(/[^0-9]/g, "");
  return parseInt(cleanedText, 10);
}

export function FormatCurrency(number: number): string {
  return `${number.toLocaleString("vi-VI", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} VND`;
}
