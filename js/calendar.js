
export function parseGameDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    // Use UTC to avoid local time zone and daylight-saving issues.
    return new Date(Date.UTC(year, month - 1, day));
}

export function formatGameDate(date) {
    return date.toISOString().slice(0, 10);
}

export function addDays(dateString, days) {
    const date = parseGameDate(dateString);

    date.setUTCDate(date.getUTCDate() + days);

    return formatGameDate(date);
}

export function calculateAge(birthDate, currentDate) {
    const birth = parseGameDate(birthDate);
    const current = parseGameDate(currentDate);

    const birthYear = birth.getUTCFullYear();
    const birthMonth = birth.getUTCMonth();
    const birthDay = birth.getUTCDate();
    const currentYear = current.getUTCFullYear();

    // Determine the birthday date in a given year.
    function birthdayInYear(year) {
        let day = birthDay;

        // February 29 becomes February 28 in non-leap years.
        if (
            birthMonth === 1 &&
            birthDay === 29 &&
            !(
                year % 4 === 0 &&
                (year % 100 !== 0 || year % 400 === 0)
            )
        ) {
            day = 28;
        }

        return new Date(Date.UTC(year, birthMonth, day));
    }

    // Start with this year's birthday.
    let lastBirthday = birthdayInYear(currentYear);

    // If it hasn't happened yet, use the previous year's birthday.
    if (current < lastBirthday) {
        lastBirthday = birthdayInYear(currentYear - 1);
    }

    const years =
        lastBirthday.getUTCFullYear() - birthYear;

    const daysSinceBirthday = Math.floor(
        (current - lastBirthday) / (1000 * 60 * 60 * 24)
    );

    return { years, daysSinceBirthday };
}
