import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
} from '@microsoft/sp-property-pane';

import { IPropertyFieldPasswordProps, IPropertyFieldPasswordPropsInternal } from './IPropertyFieldPassword';
import PropertyFieldPasswordHost from './PropertyFieldPasswordHost';

class PropertyFieldPasswordBuilder implements IPropertyPaneField<IPropertyFieldPasswordPropsInternal> {
  public targetProperty: string;
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public properties: IPropertyFieldPasswordPropsInternal;


  private _onChangeCallback: (targetProperty?: string, newValue?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

  public constructor(_targetProperty: string, _properties: IPropertyFieldPasswordPropsInternal) {
    this.targetProperty = _targetProperty;
    this.properties = _properties;

    this.properties.onRender = this._render.bind(this);
    this.properties.onDispose = this._dispose.bind(this);
  }

  private _render(elem: HTMLElement, context?: any, changeCallback?: (targetProperty?: string, newValue?: any) => void): void { // eslint-disable-line @typescript-eslint/no-explicit-any

    const props: IPropertyFieldPasswordProps = <IPropertyFieldPasswordProps>this.properties;

    const element = React.createElement(PropertyFieldPasswordHost, {
      ...props,
      onChanged: this._onChanged.bind(this)
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

export function PropertyFieldPassword(targetProperty: string, properties: IPropertyFieldPasswordProps): IPropertyPaneField<IPropertyFieldPasswordPropsInternal> {
  return new PropertyFieldPasswordBuilder(targetProperty, {
    ...properties,
    onChanged: properties.onChanged,
    onRender: null,
    onDispose: null
  });
}
