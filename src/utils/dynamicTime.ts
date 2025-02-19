export function getTimeSince (timeStamp: number) {
  const now = new Date(),
    secondsPast = (now.getTime() - timeStamp) / 1000
  if (secondsPast < 60) {
    return Math.floor(secondsPast) + 's'
  }
  if (secondsPast < 3600) {
    return Math.floor(secondsPast / 60) + 'm'
  }
  if (secondsPast <= 86400) {
    return Math.floor(secondsPast / 3600) + 'h'
  }
  if (secondsPast > 86400) {
    const timeStampDate = new Date(timeStamp)
    const day = timeStampDate.getDate()
    const month = timeStampDate
      .toDateString()
      .match(/ [a-zA-Z]*/)?.[0]
      .replace(' ', '')
    const year =
    timeStampDate.getFullYear() == now.getFullYear()
        ? ''
        : ' ' + timeStampDate.getFullYear()
    return day + ' ' + month + year
  }
}
