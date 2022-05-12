import * as React from 'react';
import styles from '../PropertyFieldTreeCollectionDataHost.module.scss';
import { Async } from 'office-ui-fabric-react/lib/Utilities';
import { ICollectionNumberFieldProps, ICollectionNumberFieldState } from '.';
import { ICustomTreeCollectionField } from '..';
import { isEqual } from '@microsoft/sp-lodash-subset';

export class CollectionNumberField extends React.Component<ICollectionNumberFieldProps, ICollectionNumberFieldState> {
  private async: Async;
  private delayedValidate: (field: ICustomTreeCollectionField, inputVal: number) => void;

  constructor(props: ICollectionNumberFieldProps) {
    super(props);

    this.state = {
      value: null,
      errorMessage: ''
    };

    this.async = new Async(this);
    this.delayedValidate = this.async.debounce(this.valueValidation, (this.props.field.deferredValidationTime || this.props.field.deferredValidationTime >= 0) ? this.props.field.deferredValidationTime : 200);
  }

  /**
   * componentWillMount lifecycle hook
   */
  public componentWillMount(): void {
    this.setState({
      value: this.props.item[this.props.field.id]
    });
    this.valueChange(this.props.field, this.props.item[this.props.field.id]);
  }

  /**
   * componentWillUpdate lifecycle hook
   *
   * @param nextProps
   * @param nextState
   */
  public componentWillUpdate(nextProps: ICollectionNumberFieldProps, nextState: ICollectionNumberFieldState): void {
    if (!isEqual(nextProps.item, this.props.item)) {
      this.setState({
        value: nextProps.item[nextProps.field.id]
      });
    }
  }

  /**
   * Value change event handler
   *
   * @param field
   * @param value
   */
  private valueChange = async (field: ICustomTreeCollectionField, value: string | number) => {
    const inputVal = typeof value === "string" ? parseInt(value) : value;
    this.setState({
      value: inputVal
    });
    await this.props.fOnValueChange(field.id, value);
    this.delayedValidate(field, inputVal);
  }

  /**
   * Delayed field validation
   */
  private valueValidation = async (field: ICustomTreeCollectionField, value: number) => {
    // debugger;
    const validation = await this.props.fValidation(field, value);
    // Update the error message
    this.setState({
      errorMessage: validation
    });
  }

  /**
   * Default React render method
   */
  public render(): React.ReactElement<ICollectionNumberFieldProps> {
    const {
      errorMessage,
      value
    } = this.state;
    return (
      <div className={`PropertyFieldTreeCollectionData__panel__number-field ${styles.numberField} ${errorMessage ? styles.invalidField : ""}`}>
        <input type="number"
               role="spinbutton"
               placeholder={this.props.field.placeholder || this.props.field.title}
               aria-valuemax={99999}
               aria-valuemin={-999999}
               aria-valuenow={this.props.item[this.props.field.id] || ''}
               aria-invalid={!!errorMessage}
               value={(!value && value !== 0) ? '' : value}
               onChange={async (ev) => await this.valueChange(this.props.field, ev.target.value)}
               disabled={this.props.disableEdit} />
      </div>
    );
  }
}
