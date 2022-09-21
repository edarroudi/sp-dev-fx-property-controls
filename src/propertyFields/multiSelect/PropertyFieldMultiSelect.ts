import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
} from '@microsoft/sp-property-pane';

import PropertyFieldMultiSelectHost from './PropertyFieldMultiSelectHost';

import { IPropertyFieldMultiSelectPropsInternal, IPropertyFieldMultiSelectProps } from './IPropertyFieldMultiSelect';
import { cloneDeep } from '@microsoft/sp-lodash-subset';
import omit from 'lodash/omit';

class PropertyFieldMultiSelectBuilder implements IPropertyPaneField<IPropertyFieldMultiSelectPropsInternal> {
  public targetProperty: string;
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public properties: IPropertyFieldMultiSelectPropsInternal;


  private _onChangeCallback: (targetProperty?: string, newValue?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

  public constructor(_targetProperty: string, _properties: IPropertyFieldMultiSelectPropsInternal) {
    this.targetProperty = _targetProperty;
    this.properties = _properties;

    this.properties.onRender = this._render.bind(this);
    this.properties.onDispose = this._dispose.bind(this);
  }

  private _render(elem: HTMLElement, context?: any, changeCallback?: (targetProperty?: string, newValue?: any) => void): void { // eslint-disable-line @typescript-eslint/no-explicit-any

    const props: IPropertyFieldMultiSelectProps = <IPropertyFieldMultiSelectProps>this.properties;

    const element = React.createElement(PropertyFieldMultiSelectHost, {
      ...omit(props, ['options', 'ariaPositionInSet', 'ariaSetSize']),
      options: props.options as IDropdownOption[] || [],
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

  private _onChanged(item: IDropdownOption): void {
    if (this._onChangeCallback) {
      // Get all the selected keys
      const updateSelectedKeys: (string | number)[] = this.properties.selectedKeys ? cloneDeep(this.properties.selectedKeys) : [];

      // Check if item got selected
      if (item.selected) {
        updateSelectedKeys.push(item.key);
      } else {
        // Remove the item from the selected keys list
        const itemIdx = updateSelectedKeys.indexOf(item.key);
        if (itemIdx > -1) {
          updateSelectedKeys.splice(itemIdx, 1);
        }
      }

      this._onChangeCallback(this.targetProperty, updateSelectedKeys);
    }
  }
}

export function PropertyFieldMultiSelect(targetProperty: string, properties: IPropertyFieldMultiSelectProps): IPropertyPaneField<IPropertyFieldMultiSelectPropsInternal> {
  return new PropertyFieldMultiSelectBuilder(targetProperty, {
    ...properties,
    onRender: null,
    onDispose: null
  });
}
