
export interface IRuleTreeNodeProps {
  //fields: ICustomCollectionField[];
  index?: number;
  item?: any;
  sortingEnabled?: boolean;
  totalItems?: number;
  disableItemDeletion?: boolean;

  fAddItem?: (item: any) => void;
  fAddInCreation?: (item: any, isValid: boolean) => void;
  fUpdateItem?: (idx: number, item: any) => void;
  fDeleteItem?: (idx: number) => void;
  fValidation?: (idx: number, isValid: boolean) => void;
  fOnSorting?: (oldIdx: number, newIdx: number) => void;
}
