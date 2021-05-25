import moment from 'moment';

export const formatDate = date => {
  if(!date) return 'Never';

  const d = new Date(date);
  const year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  return `${month}-${day}-${year}`
};

export const timeAgo = date => {
  return moment(date).fromNow();
}