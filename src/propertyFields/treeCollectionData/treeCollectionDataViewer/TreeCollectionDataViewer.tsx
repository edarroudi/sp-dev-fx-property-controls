import * as React from 'react';
import styles from '../PropertyFieldTreeCollectionDataHost.module.scss';
import { ITreeCollectionDataViewerProps, ITreeCollectionDataViewerState } from '.';
import { TreeCollectionDataItem } from '../treeCollectionDataItem';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import * as strings from 'PropertyControlStrings';
import { cloneDeep } from '@microsoft/sp-lodash-subset';
import { TreeView, ITreeItem } from "@pnp/spfx-controls-react/lib/TreeView";
import { getGUID } from '@pnp/common';
import { ICustomTreeItem } from '../ICustomTreeItem';

export class TreeCollectionDataViewer extends React.Component<ITreeCollectionDataViewerProps, ITreeCollectionDataViewerState> {
  private readonly SORT_IDX = "sortIdx";

  constructor(props: ITreeCollectionDataViewerProps) {
    super(props);

    this.state = {
      crntItems: [],
      validation: {},
      isLoading: true
    };
  }


  private initItemKeys = (item: ICustomTreeItem, key: string, parentKey: string, level: number, sortIdx: number): ITreeItem => {
    return {
      'key': key,
      'label': '', 'data': {
        ...item.data, //TODO clean data if we got from const fields to dynamic fields?
        "parent": parentKey,
        "level": level,
        "sortIdx": sortIdx
      },
      'children': item.children?.map((childItem, childIndex) => this.initItemKeys(childItem, getGUID(), key, level + 1, childIndex + 1))
    };
  }

  /**
   * componentDidMount lifecycle hook
   */
  public componentDidMount(): void {
    let crntItems = this.props.value ? cloneDeep(this.props.value) : [{ key: 'root', label: 'root', data: { parent: null, level: 0, value: {} }, children: [] },];

    this.setState({
      crntItems: [this.initItemKeys(crntItems[0], 'root', null, 0, 1)]
      , isLoading: false
    });
  }

  private findNode = (tree: ITreeItem[], key: string) => {
    const stack = [tree[0]];
    while (stack.length) {
      const node = stack.pop();
      if (node.key === key) return node;
      // tslint:disable-next-line:no-unused-expression
      node.children && stack.push(...node.children);
    }
    return null;
  }

  private addItem = async (parentKey: string, itemData: any) => {

    this.setState((prevState: ITreeCollectionDataViewerState): ITreeCollectionDataViewerState => {
      const { crntItems } = prevState;

      const treeItem = this.findNode(crntItems, parentKey);
      const nItem: ITreeItem = { key: getGUID(), label: `${treeItem.children?.length ?? 0}`, data: { parent: treeItem.key, level: treeItem.data.level + 1, value: itemData, sortIdx: treeItem.children.length + 1 }, children: [] };
      treeItem.children.push(nItem);
      return { crntItems, isLoading: false };
    });
  }

  private removeItem = async (key: string, parentKey: string) => {
    if (!parent)
      return;

    this.setState((prevState: ITreeCollectionDataViewerState): ITreeCollectionDataViewerState => {
      let { crntItems, validation } = prevState;
      const parent = this.findNode(crntItems, parentKey);
      parent.children = parent.children.filter(_ => key !== _.key);

      //crntItems.splice(idx, 1);
      delete validation[key];

      // Update the sort propety
      crntItems = this.updateSortProperty(crntItems);

      return { crntItems, validation, isLoading: false };
    });
  }

  /**
   * Update an item from the tree
   */
  private updateItem = (key: string, item: any) => {
    this.setState((prevState: ITreeCollectionDataViewerState): ITreeCollectionDataViewerState => {
      const { crntItems } = prevState;
      // Update the item in the array
      const treeItem = this.findNode(crntItems, key);
      treeItem.data.value = item;
      return { crntItems, isLoading: false };
    });
  }


  /**
   * Validate every item
   */
  private validateItem = (key: string, isValid: boolean) => {

    this.setState((prevState: ITreeCollectionDataViewerState) => {
      const { validation } = prevState;
      validation[key] = isValid;
      return {
        validation: prevState.validation
      };
    });
  }

  /**
   * Check if all items are valid
   */
  private allItemsValid() {

    const { validation } = this.state;
    if (validation) {
      const keys = Object.keys(validation);
      for (const key of keys) {
        if (!validation[key]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Move an item in the array
   *
   * @param crntItems
   * @param oldIdx
   * @param newIdx
   */
  private moveItemTo(crntItems: any[], oldIdx: number, newIdx: number): any[] {
    if (newIdx > -1 && newIdx < crntItems.length) {
      const removedElement = crntItems.splice(oldIdx, 1)[0];
      if (removedElement) {
        crntItems.splice(newIdx, 0, removedElement);
      }
    }
    return crntItems;
  }

  /**
   * Update the sort property
   *
   * @param crntItems
   */
  private updateSortProperty(crntItems: any[]): any[] {
    // Update the sort order
    return crntItems.map((item, itemIdx) => {
      item.data.sortIdx = itemIdx + 1;
      return item;
    });
  }

  /**
   * Update the sort order
   */
  private updateSortOrder = (parentKey: string, oldIdx: number, newIdx: number) => {

    let newOrderedItems = cloneDeep(this.state.crntItems);
    const parentItem = this.findNode(newOrderedItems, parentKey);
    parentItem.children = this.moveItemTo(parentItem.children, oldIdx, newIdx - 1);
    parentItem.children = this.updateSortProperty(parentItem.children);

    this.setState({
      crntItems: newOrderedItems
    });
  }


  private cleanupMap = (item: ITreeItem) => {
    const { value } = item.data;
    return { 'data': { 'value': value }, 'children': item.children?.map(childItem => this.cleanupMap(childItem)) };
  }

  /**
   * Save the collection data
   */
  private onSave = () => {

    const mapped = this.state.crntItems.map(item => this.cleanupMap(item));
    this.props.fOnSave(mapped);

  }

  /**
   * Cancel
   */
  private onCancel = () => {
    this.props.fOnClose();
  }

  private renderItem = (item: ITreeItem): JSX.Element => {

    let fields;

    if (typeof (this.props.fields) === 'function') {
      fields = this.props.fields(item);
    }
    else {
      fields = this.props.fields;
    }

    const parentItem = item.data.parent ? this.findNode(this.state.crntItems, item.data.parent) : undefined;


    return <TreeCollectionDataItem
      itemKey={item.key}
      key={item.key}
      fields={fields}
      index={item.data.sortIdx}
      itemData={item.data.value}
      parentKey={item.data.parent}
      totalItems={parentItem?.children?.length ?? 0}
      enableSorting={this.props.enableSorting}
      disableItemDeletion={this.props.disableItemDeletion}
      disableItemCreation={this.props.disableItemCreation}
      fUpdateItem={this.updateItem}
      fDeleteItem={item.data.parent ? this.removeItem : undefined}
      fValidation={this.validateItem}
      fOnSorting={this.updateSortOrder}
      fAddItem={this.addItem}
    />;
  }

  /**
   * Default React render
   */
  public render(): React.ReactElement<ITreeCollectionDataViewerProps> {

    if (this.state.isLoading) return <div></div>;

    return (
      <div>
        <div className={`PropertyFieldTreeCollectionData__panel__table ${styles.table} ${this.props.tableClassName || ""}`}>
          {
            (this.state.crntItems && this.state.crntItems.length > 0) && (
              <TreeView key="treeView" items={this.state.crntItems} onRenderItem={this.renderItem} defaultExpanded />
            )
          }
        </div>
        {
          (!this.state.crntItems || this.state.crntItems.length === 0) && (
            <p className={`PropertyFieldTreeCollectionData__panel__no-collection-data ${styles.noTreeCollectionData}`}>{strings.TreeCollectionDataEmptyValue}</p>
          )
        }

        <div className={`PropertyFieldTreeCollectionData__panel__actions ${styles.panelActions}`}>
          <PrimaryButton text={this.props.saveBtnLabel || strings.SaveButtonLabel} onClick={this.onSave} disabled={!this.allItemsValid()} className="PropertyFieldTreeCollectionData__panel__action__save" />
          <DefaultButton text={this.props.cancelBtnLabel || strings.CancelButtonLabel} onClick={this.onCancel} className="PropertyFieldTreeCollectionData__panel__action__cancel" />
        </div>
      </div>
    );
  }
}
