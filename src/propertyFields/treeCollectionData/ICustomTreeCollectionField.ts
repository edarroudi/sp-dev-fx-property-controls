import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { IRenderFunction } from '@uifabric/utilities/lib/IRenderFunction';
import { ISelectableOption } from 'office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.types';
import { CollectionIconFieldRenderMode } from './treeCollectionIconField';


export interface ICustomTreeDropdownOption extends Omit<IDropdownOption, 'key'>
{
  key: string | number | boolean;
}

export interface ICustomTreeCollectionField {
  /**
   * ID of the field.
   */
  id: string;
  /**
   * Title of the field. This will be used for the label in the table.
   */
  title: string;
  /**
   * Specifies the type of field to render.
   */
  type: CustomTreeCollectionFieldType;
  /**
   * Allows you to specify if a field is disabled for editing
   */
  disableEdit?: boolean;
  /**
   * Specify if the field is required.
   */
  required?: boolean;
  /**
   * Dropdown options. Only nescessary when dropdown type is used.
   * Options can be either a static array or a function that will calculate the values dynamically and can react to the current item.
   */
  options?: ICustomTreeDropdownOption[] | ((fieldId: string, item: any) => ICustomTreeDropdownOption[]);
  /**
   * Dropdown custom options render method.
   */
  onRenderOption?: IRenderFunction<ISelectableOption>;
  /**
   * Input placeholder text.
   */
  placeholder?: string;
  /**
   * Default value for the field
   */
  defaultValue?: any;
  /**
   * Field will start to validate after users stop typing for `deferredValidationTime` milliseconds. Default: 200ms.
   */
  deferredValidationTime?: number;
  /**
   * The method is used to get the validation error message and determine whether the input value is valid or not.
   *
   * When it returns string:
   * - If valid, it returns empty string.
   * - If invalid, the field will show a red border
   */
  onGetErrorMessage?: (value: any, index: number, currentItem: any) => string | Promise<string>;

  /**
   * Custom field rendering support
   */
  onCustomRender?: (field: ICustomTreeCollectionField, value: any, onUpdate: (fieldId: string, value: any) => void, item: any, rowUniqueId: string, onCustomFieldValidation: (fieldId: string, errorMessage: string) => void) => JSX.Element;
  /**
   * Custom field visibility support
   */
  isVisible?: (field: ICustomTreeCollectionField, items: any[]) => boolean;

  /**
   * Icon field render mode
   */
  iconFieldRenderMode?: CollectionIconFieldRenderMode;
}

export enum CustomTreeCollectionFieldType {
  string = 1,
  number,
  boolean,
  dropdown,
  fabricIcon,
  url,
  custom,
  color
}
