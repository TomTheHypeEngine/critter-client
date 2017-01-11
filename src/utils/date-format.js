import moment from 'moment';

export class DateFormatValueConverter {
  toView(value) {
    return moment(value).format('hh:mm:ss DD.MM.YYYY');
  }
}
