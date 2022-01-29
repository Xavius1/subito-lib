import moment from 'moment';
class Data {
    constructor(value) {
        this.value = value;
    }
    parseType(type) {
        const { value } = this;
        switch (type) {
            case 'Array':
                return value.split(',');
            case 'Bool':
                return (value === true || value === 'true');
            case 'Date':
                return moment(value).toDate();
            case 'Float':
                this.value = parseFloat(value);
                return this.NaNtoNull();
            case 'Int':
                this.value = parseInt(value, 10);
                return this.NaNtoNull();
            default:
                return value;
        }
    }
    ucfirst() {
        const { value } = this;
        return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
    }
    NaNtoNull() {
        const { value } = this;
        if (Number.isNaN(value)) {
            return null;
        }
        return value;
    }
}
export default Data;
