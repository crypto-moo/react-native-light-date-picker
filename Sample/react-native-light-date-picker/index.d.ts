
import React from 'react';

interface DatePickerProps {
    /**
     * 日期格式,用于日期格式化
     * 
     * @type {string}
     * @memberof DatePickerProps
     */
    dateFormat?: string;
    /**
     * 弹出日期选择器时,默认选择的日期
     * 
     * @type {Date}
     * @memberof DatePickerProps
     */
    date?: Date;
    /**
     * 日期选择范围开始
     * 
     * @type {Date}
     * @memberof DatePickerProps
     */
    minimumDate?: Date;
    /**
     * 日期选择范围结束
     * 
     * @type {Date}
     * @memberof DatePickerProps
     */
    maximumDate?: Date;
    /**
     * 确认选择日期
     * 
     * @type {function}
     * @memberof DatePickerProps
     */
    onDatePicked?: function;
    /**
     * 取消选择
     * 
     * @type {function}
     * @memberof DatePickerProps
     */
    onCanceled?: function;
    /**
     * 选择的日期变化
     * iOS only
     * @type {function}
     * @memberof DatePickerProps
     */
    onDateChanged?: function;
    /**
     * 标题
     * iOS only
     * @type {string}
     * @memberof DatePickerProps
     */
    title?: string;
    /**
     * 安卓未弹出日期选择的错误情况
     * Android only
     * @type {Error}
     * @memberof DatePickerProps
     */
    onError?: Error;
}

export default class DatePicker extends React.Component<DatePickerProps> {}