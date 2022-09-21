import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
} from '@microsoft/sp-property-pane';

import { IPropertyFieldSpinnerProps, IPropertyFieldSpinnerPropsInternal } from './IPropertyFieldSpinner';
import PropertyFieldSpinnerHost from './PropertyFieldSpinnerHost';

class PropertyFieldSpinnerBuilder implements IPropertyPaneField<IPropertyFieldSpinnerPropsInternal> {
  public targetProperty: string;
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public properties: IPropertyFieldSpinnerPropsInternal;


  private _onChangeCallback: (targetProperty?: string, newValue?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

  public constructor(_targetProperty: string, _properties: IPropertyFieldSpinnerPropsInternal) {
    this.targetProperty = _targetProperty;
    this.properties = _properties;

    this.properties.onRender = this._render.bind(this);
    this.properties.onDispose = this._dispose.bind(this);
  }

  private _render(elem: HTMLElement, context?: any, changeCallback?: (targetProperty?: string, newValue?: any) => void): void { // eslint-disable-line @typescript-eslint/no-explicit-any

    const props: IPropertyFieldSpinnerProps = <IPropertyFieldSpinnerProps>this.properties;

    const element = React.createElement(PropertyFieldSpinnerHost, {
      ...props
    });

    ReactDOM.render(element, elem);

    if (changeCallback) {
      this._onChangeCallback = changeCallback;
    }
  }

  private _dispose(elem: HTMLElement): void {
    ReactDOM.unmountComponentAtNode(elem);
  }

  private _onChanged(value: string): void {
    if (this._onChangeCallback) {
      this._onChangeCallback(this.targetProperty, value);
    }
  }

}

export function PropertyFieldSpinner(targetProperty: string, properties: IPropertyFieldSpinnerProps): IPropertyPaneField<IPropertyFieldSpinnerPropsInternal> {
  return new PropertyFieldSpinnerBuilder(targetProperty, {
    ...properties,
    onRender: null,
    onDispose: null
  });
}
