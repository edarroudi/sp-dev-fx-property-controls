import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType
} from '@microsoft/sp-property-pane';

import PropertyFieldTextWithCalloutHost from './PropertyFieldTextWithCalloutHost';

import { IPropertyFieldTextWithCalloutPropsInternal, IPropertyFieldTextWithCalloutProps } from './IPropertyFieldTextWithCallout';

import omit from 'lodash/omit';

class PropertyFieldTextWithCalloutBuilder implements IPropertyPaneField<IPropertyFieldTextWithCalloutPropsInternal> {
    public targetProperty: string;
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public properties: IPropertyFieldTextWithCalloutPropsInternal;

    private _onChangeCallback: (targetProperty?: string, newValue?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

    public constructor(_targetProperty: string, _properties: IPropertyFieldTextWithCalloutPropsInternal) {
        this.targetProperty = _targetProperty;
        this.properties = _properties;

        this.properties.onRender = this._render.bind(this);
        this.properties.onDispose = this._dispose.bind(this);
        this.properties.onChanged = this._onChanged.bind(this);
    }

    private _render(elem: HTMLElement, context?: any, changeCallback?: (targetProperty?: string, newValue?: any) => void): void { // eslint-disable-line @typescript-eslint/no-explicit-any

        const props: IPropertyFieldTextWithCalloutProps = <IPropertyFieldTextWithCalloutPropsInternal>this.properties;

        const element = React.createElement(PropertyFieldTextWithCalloutHost, {
            ...omit(props, ['logName']),
            onNotifyValidationResult: this._onValidated.bind(this),
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

    private _onValidated(errorMessage: string, value: string | undefined): void {
        if (!errorMessage && this._onChangeCallback) {
            this._onChangeCallback(this.targetProperty, value);
        }
    }

    private _onChanged(value: string): void {
        if (this._onChangeCallback) {
          this._onChangeCallback(this.targetProperty, value);
        }
      }
}

export function PropertyFieldTextWithCallout(targetProperty: string, properties: IPropertyFieldTextWithCalloutProps): IPropertyPaneField<IPropertyFieldTextWithCalloutPropsInternal> {
    return new PropertyFieldTextWithCalloutBuilder(targetProperty, {
        ...properties,
        onChanged: properties.onChanged,
        onRender: null,
        onDispose: null
    });
}
