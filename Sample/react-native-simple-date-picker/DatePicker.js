
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    DatePickerIOS,
    DatePickerAndroid,
    Platform,
    Modal,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';

const SCREEN_HEIGHT: number = Dimensions.get('window').height;
const SCREEN_WIDTH: number = Dimensions.get('window').width;
const IS_IPHONE_X_SERIES: boolean = Platform.OS === 'ios' && (SCREEN_HEIGHT / SCREEN_WIDTH > 2);
const SAFE_AREA_BOTTOM: number = IS_IPHONE_X_SERIES ? 34 : 0;

const IOS_PICKER_VIEW_HEIGHT = 250;

function FormatDate(fmt: string, date: Date):? string {
    if (!date || !fmt) {
        return null;
    }
    let o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        'S': date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
}

export default class DatePicker extends React.Component {
    selectedDate: Date;

    static propTypes = {
        dateFormat: PropTypes.string,
        date: PropTypes.instanceOf(Date),
        minimumDate: PropTypes.instanceOf(Date),
        maximumDate: PropTypes.instanceOf(Date),

        onDatePicked: PropTypes.func,
        onCanceled: PropTypes.func,
        // iOS only
        onDateChanged: PropTypes.func,
        title: PropTypes.string,
        // Android only
        onError: PropTypes.func
    }

    static defaultProps = {
        dateFormat: 'yyyy-MM-dd',
        date: new Date(),
        minimumDate: new Date(),
        maximumDate: new Date(3000, 1, 1)
    };

    constructor(props){
        super(props);
        this.save(this.props.date);
        this.state = {
            modalvisible: false
        };
    }

    render() {
        if (Platform.OS === 'android') {
            return null;
        }
        return <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.modalvisible}
            onRequestClose={()=>{}}
        >
            {this.renderDatePickerIOS()}
        </Modal>;
    }

    renderDatePickerIOS() {
        return <TouchableOpacity style={styles.mContainer}
            activeOpacity={1}
            onPress={this.cancel.bind(this)}
        >
            <View style={styles.modalContent}>
                <View style={styles.modalTitle}>
                    <TouchableOpacity onPress={this.cancel.bind(this)}>
                        <Text style={{fontSize: 14, alignSelf: 'center', color: '#666666'}}>取消</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize:15, color: '#FFF'}}>{this.props.title}</Text>
                    <TouchableOpacity onPress={this.sure.bind(this)}>
                        <Text style={{fontSize: 14, alignSelf: 'center', color: '#1c2546'}}>确认</Text>
                    </TouchableOpacity>
                </View>
                <DatePickerIOS
                    date={this.selectedDate}
                    onDateChange={(date)=> {
                        this.save(date);
                        const { onDateChanged, dateFormat } = this.props;
                        if (onDateChanged) {
                            onDateChanged(date, FormatDate(dateFormat, date));
                        }
                    }}
                    mode={'date'}
                    minimumDate={this.props.minimumDate}
                    maximumDate={this.props.maximumDate}
                />
            </View>
        </TouchableOpacity>;
    }

    async selectDate(){
        try {
            const { minimumDate, maximumDate } = this.props;
            const { action, year, month, day } = await DatePickerAndroid.open({
                minDate: minimumDate,
                maxDate: maximumDate,
                mode: 'default'
            });
            const {
                dateSetAction,
                dismissedAction
            } = DatePickerAndroid;
            if (action === dateSetAction) {
                const date = new Date(year, month, day);
                this.save(date);
                this.sure();
            } else if (action === dismissedAction) {
                this.cancel();
            }
        } catch (error) {
            const { onError } = this.props;
            onError && onError(error);
        }
    }

    closeModal() {
        this.setState({
            modalvisible: false
        });
    }

    cancel() {
        const { onCanceled } = this.props;
        onCanceled && onCanceled();
        this.closeModal();
    }

    sure() {
        this.perfromCallback();
        this.closeModal();
    }

    perfromCallback() {
        const { onDatePicked } = this.props;
        if (onDatePicked) {
            onDatePicked(this.selectedDate, this.selectedDateFormat);
        }
    }

    save(date) {
        this.selectedDate = date;
        this.selectedDateFormat = FormatDate(this.props.dateFormat, date);
    }

    show() {
        if (Platform.OS === 'android') {
            this.selectDate();
            return;
        }
        this.setState({
            modalvisible: true
        });
    }
}

const styles = StyleSheet.create({
    mContainer: {
        flex: 1
    },
    modalContent: {
        backgroundColor: 'white',
        marginTop: SCREEN_HEIGHT - SAFE_AREA_BOTTOM - IOS_PICKER_VIEW_HEIGHT,
        height: IOS_PICKER_VIEW_HEIGHT
    },
    modalTitle: {
        height: 44,
        backgroundColor: '#E1E1E1',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});
