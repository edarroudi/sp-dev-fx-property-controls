import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneField,
  PropertyPaneFieldType
} from '@microsoft/sp-property-pane';
import { BaseComponentContext } from '@microsoft/sp-component-base';
import PropertyFieldListPickerHost from './PropertyFieldListPickerHost';
import PropertyFieldListMultiPickerHost from './PropertyFieldListMultiPickerHost';
import { IPropertyFieldListPickerHostProps, ISPList } from './IPropertyFieldListPickerHost';
import { IPropertyFieldListMultiPickerHostProps } from './IPropertyFieldListMultiPickerHost';
import { PropertyFieldListPickerOrderBy, IPropertyFieldListPickerProps, IPropertyFieldListPickerPropsInternal, IPropertyFieldList } from './IPropertyFieldListPicker';

/**
 * Represents a PropertyFieldListPicker object
 */
class PropertyFieldListPickerBuilder implements IPropertyPaneField<IPropertyFieldListPickerPropsInternal> {

  //Properties defined by IPropertyPaneField
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyFieldListPickerPropsInternal;

  //Custom properties label: string;
  private label: string;
  private context: BaseComponentContext;
  private webAbsoluteUrl?: string;
  private selectedList: string | IPropertyFieldList;
  private selectedLists: string[] | IPropertyFieldList[];
  private baseTemplate: number;
  private orderBy: PropertyFieldListPickerOrderBy;
  private multiSelect: boolean;
  private showSelectAll: boolean;
  private selectAllInList: boolean;
  private selectAllInListLabel: string;
  private includeHidden: boolean;
  private listsToExclude: string[];
  private includeListTitleAndUrl: boolean;

  public onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void { /* no-op; */ } // eslint-disable-line @typescript-eslint/no-explicit-any
  private customProperties: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  private key: string;
  private disabled: boolean = false;
  private onGetErrorMessage: (value: string) => string | Promise<string>;
  private deferredValidationTime: number = 200;
  private renderWebPart: () => void;
  private disableReactivePropertyChanges: boolean = false;
  private filter: string;
  private contentTypeId: string;
  private onListsRetrieved?: (lists: ISPList[]) => PromiseLike<ISPList[]> | ISPList[];
  /**
   * Constructor method
   */
  public constructor(_targetProperty: string, _properties: IPropertyFieldListPickerPropsInternal) {
    this.render = this.render.bind(this);
    this.targetProperty = _targetProperty;
    this.properties = _properties;
    this.properties.onDispose = this.dispose;
    this.properties.onRender = this.render;
    this.label = _properties.label;
    this.context = _properties.context;
    this.webAbsoluteUrl = _properties.webAbsoluteUrl;
    this.selectedList = _properties.selectedList;
    this.selectedLists = _properties.selectedLists;
    this.baseTemplate = _properties.baseTemplate;
    this.orderBy = _properties.orderBy;
    this.multiSelect = _properties.multiSelect;
    this.showSelectAll = _properties.showSelectAll;
    this.selectAllInList = _properties.selectAllInList;
    this.selectAllInListLabel = _properties.selectAllInListLabel;
    this.includeHidden = _properties.includeHidden;
    this.onPropertyChange = _properties.onPropertyChange;
    this.customProperties = _properties.properties;
    this.key = _properties.key;
    this.onGetErrorMessage = _properties.onGetErrorMessage;
    this.listsToExclude = _properties.listsToExclude;
    this.filter = _properties.filter;
    this.onListsRetrieved = _properties.onListsRetrieved;
    this.includeListTitleAndUrl = _properties.includeListTitleAndUrl;
    this.contentTypeId=_properties.contentTypeId;

    if (_properties.disabled === true) {
      this.disabled = _properties.disabled;
    }
    if (_properties.deferredValidationTime) {
      this.deferredValidationTime = _properties.deferredValidationTime;
    }
  }

  /**
   * Renders the SPListPicker field content
   */
  private render(elem: HTMLElement, ctx?: any, changeCallback?: (targetProperty?: string, newValue?: any) => void): void { // eslint-disable-line @typescript-eslint/no-explicit-any
    const componentProps: IPropertyFieldListPickerHostProps = {
      label: this.label,
      targetProperty: this.targetProperty,
      context: this.context,
      webAbsoluteUrl: this.webAbsoluteUrl,
      baseTemplate: this.baseTemplate,
      orderBy: this.orderBy,
      multiSelect: this.multiSelect,
      includeHidden: this.includeHidden,
      onDispose: this.dispose,
      onRender: this.render,
      onChange: changeCallback,
      onPropertyChange: this.onPropertyChange,
      properties: this.customProperties,
      key: this.key,
      disabled: this.disabled,
      onGetErrorMessage: this.onGetErrorMessage,
      deferredValidationTime: this.deferredValidationTime,
      listsToExclude: this.listsToExclude,
      filter: this.filter,
      onListsRetrieved: this.onListsRetrieved,
      includeListTitleAndUrl: this.includeListTitleAndUrl,
      contentTypeId:this.contentTypeId
    
    };

    // Check if the multi or single select component has to get loaded
    if (this.multiSelect) {
      // Multi selector
      componentProps.selectedLists = this.selectedLists;
      componentProps.showSelectAll = this.showSelectAll;
      componentProps.selectAllInList = this.selectAllInList;
      componentProps.selectAllInListLabel = this.selectAllInListLabel;
      const element: React.ReactElement<IPropertyFieldListMultiPickerHostProps> = React.createElement(PropertyFieldListMultiPickerHost, componentProps);
      // Calls the REACT content generator
      ReactDom.render(element, elem);
    } else {
      // Single selector
      componentProps.selectedList = this.selectedList;
      const element: React.ReactElement<IPropertyFieldListPickerHostProps> = React.createElement(PropertyFieldListPickerHost, componentProps);
      // Calls the REACT content generator
      ReactDom.render(element, elem);
    }
  }

  /**
   * Disposes the current object
   */
  private dispose(elem: HTMLElement): void {
    ReactDom.unmountComponentAtNode(elem);
  }

}

/**
 * Helper method to create a SPList Picker on the PropertyPane.
 * @param targetProperty - Target property the SharePoint list picker is associated to.
 * @param properties - Strongly typed SPList Picker properties.
 */
export function PropertyFieldListPicker(targetProperty: string, properties: IPropertyFieldListPickerProps): IPropertyPaneField<IPropertyFieldListPickerPropsInternal> {

  //Create an internal properties object from the given properties
  const newProperties: IPropertyFieldListPickerPropsInternal = {
    label: properties.label,
    targetProperty: targetProperty,
    context: properties.context,
    webAbsoluteUrl: properties.webAbsoluteUrl,
    selectedList: !Array.isArray(properties.selectedList) ? properties.selectedList : null,
    selectedLists: Array.isArray(properties.selectedList) ? properties.selectedList : null,
    baseTemplate: properties.baseTemplate,
    orderBy: properties.orderBy,
    multiSelect: properties.multiSelect || false,
    showSelectAll: properties.showSelectAll || false,
    selectAllInList: properties.selectAllInList || false,
    selectAllInListLabel: properties.selectAllInListLabel,
    includeHidden: properties.includeHidden,
    onPropertyChange: properties.onPropertyChange,
    properties: properties.properties,
    onDispose: null,
    onRender: null,
    key: properties.key,
    disabled: properties.disabled,
    onGetErrorMessage: properties.onGetErrorMessage,
    deferredValidationTime: properties.deferredValidationTime,
    listsToExclude: properties.listsToExclude,
    filter: properties.filter,
    onListsRetrieved: properties.onListsRetrieved,
    includeListTitleAndUrl: properties.includeListTitleAndUrl,
    contentTypeId:properties.contentTypeId
  };
  //Calls the PropertyFieldListPicker builder object
  //This object will simulate a PropertyFieldCustom to manage his rendering process
  return new PropertyFieldListPickerBuilder(targetProperty, newProperties);
}
