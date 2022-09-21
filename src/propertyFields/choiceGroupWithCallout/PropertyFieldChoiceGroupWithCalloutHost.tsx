import * as React from 'react';
import omit from 'lodash/omit';

import PropertyFieldHeader from '../../common/propertyFieldHeader/PropertyFieldHeader';

import { IPropertyFieldChoiceGroupWithCalloutHostProps } from './IPropertyFieldChoiceGroupWithCalloutHost';
import * as telemetry from '../../common/telemetry';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/components/ChoiceGroup';

export default class PropertyFieldToggleWithCalloutHost extends React.Component<IPropertyFieldChoiceGroupWithCalloutHostProps, null> {
    constructor(props: IPropertyFieldChoiceGroupWithCalloutHostProps) {
        super(props);

        telemetry.track('PropertyFieldToggleWithCallout', {
            disabled: props.disabled
        });
    }

    public render(): JSX.Element {
        return (
            <div>
                <PropertyFieldHeader {...this.props} />
                <ChoiceGroup {...omit(this.props, ['label'])} />
            </div>
        );
    }
}
