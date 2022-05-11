import * as React from 'react';
import styles from '../PropertyFieldRuleTreeHost.module.scss';
import { ITreeViewerProps as IRuleTreeViewerProps, ITreeViewerState as IRuleTreeViewerState } from '.';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';
import * as strings from 'PropertyControlStrings';
import { cloneDeep, sortBy } from '@microsoft/sp-lodash-subset';
import { RuleTreeNode } from '../ruleTreeNode';

export class RuleTreeViewer extends React.Component<IRuleTreeViewerProps, IRuleTreeViewerState> {
  private readonly SORT_IDX = "sortIdx";

  constructor(props: IRuleTreeViewerProps) {
    super(props);

    this.state = {
      crntItems: [],
      inCreationItem: null,
      inCreationItemValid: null,
//       validation: {}
    };
  }

  /**
   * componentDidMount lifecycle hook
   */
  public componentDidMount(): void {
    let crntItems = this.props.value ? sortBy(cloneDeep(this.props.value), this.SORT_IDX) : [];
    crntItems = crntItems.map((item, idx) => {
      if (!item[this.SORT_IDX]) {
        item[this.SORT_IDX] = idx + 1;
      }
      return item;
    });
    // Update the sort propety
    crntItems = this.updateSortProperty(crntItems);
    this.setState({
      crntItems: sortBy(crntItems, this.SORT_IDX)
    });
  }

  /**
   * Add a new item to the collection
   */
  private addItem = (item: any) => {
    this.setState((prevState: IRuleTreeViewerState): IRuleTreeViewerState => {
      let crntItems = [...prevState.crntItems, item];
      crntItems = this.updateSortProperty(crntItems);
      return {
        crntItems,
        inCreationItem: null,
        inCreationItemValid: null
      };
    });
  }

  /**
   * Remove an item from the collection
   */
  private updateItem = (idx: number, item: any) => {
    this.setState((prevState: IRuleTreeViewerState): IRuleTreeViewerState => {
      const { crntItems } = prevState;
      // Update the item in the array
      crntItems[idx] = item;
      return { crntItems };
    });
  }

  /**
   * Remove an item from the collection
   */
  private deleteItem = (idx: number) => {
    this.setState((prevState: IRuleTreeViewerState): IRuleTreeViewerState => {
      //let { crntItems, validation } = prevState;
      let { crntItems} = prevState;
      crntItems.splice(idx, 1);
      //delete validation[idx];

      // Update the sort propety
      crntItems = this.updateSortProperty(crntItems);

      return {
        crntItems: sortBy(crntItems, this.SORT_IDX),
        // validation: validation
      };
    });
  }

  /**
   * Validate every item
   */
  private validateItem = (idx: number, isValid: boolean) => {
    // TODO
    /* this.setState((prevState: ITreeViewerState) => {
      const { validation } = prevState;
      validation[idx] = isValid;
      return {
        validation: prevState.validation
      };
    });*/
  }

  /**
   * Check if all items are valid
   */
  private allItemsValid() {
    // TODO
    /* const { validation } = this.state;
    if (validation) {
      const keys = Object.keys(validation);
      for (const key of keys) {
        if (!validation[key]) {
          return false;
        }
      }
    }*/
    return true;
  }

  /**
   * Currently in creation
   */
  private addInCreation = (item: any, isValid: boolean) => {
    this.setState({
      inCreationItem: item,
      inCreationItemValid: isValid
    });
  }

  /**
   * Add the item and save the form
   */
  private addAndSave = () => {
    // Check if the item is not empty
    if (this.state.inCreationItem) {
      let crntItems = [...this.state.crntItems, this.state.inCreationItem];
      crntItems = this.updateSortProperty(crntItems);
      this.props.fOnSave(crntItems);
    } else {
      this.onSave();
    }
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
      item[this.SORT_IDX] = itemIdx + 1;
      return item;
    });
  }

  /**
   * Update the sort order
   */
  private updateSortOrder = (oldIdx: number, newIdx: number) => {
    this.setState((prevState: IRuleTreeViewerState) => {
      const { crntItems } = prevState;
      let newOrderedItems = cloneDeep(crntItems);
      newOrderedItems = this.moveItemTo(newOrderedItems, oldIdx, newIdx - 1);
      newOrderedItems = this.updateSortProperty(newOrderedItems);
      newOrderedItems = sortBy(newOrderedItems, this.SORT_IDX);

      return {
        crntItems: newOrderedItems
      };
    });
  }

  /**
   * Save the collection data
   */
  private onSave = () => {
    this.props.fOnSave(this.state.crntItems);
  }

  /**
   * Cancel
   */
  private onCancel = () => {
    this.props.fOnClose();
  }

  /**
   * Default React render
   */
  public render(): React.ReactElement<IRuleTreeViewerProps> {
    const crntItems = [...this.state.crntItems, this.state.inCreationItem].filter(i => i);
    // const visibleFields = this.props.fields.filter(f => !f.isVisible || f.isVisible(f, crntItems));
    return (
      <div>
        <div className={`PropertyFieldCollectionData__panel__table ${styles.table} ${this.props.tableClassName || ""}`}>
          <div className={`PropertyFieldCollectionData__panel__table-head ${styles.tableRow} ${styles.tableHead}`}>            
            {
            //  visibleFields.map(f => (
                // <span key={`dataviewer-${f.id}`} className={`PropertyFieldCollectionData__panel__table-cell ${styles.tableCell}`}>{f.title} { f.required && <Icon className={styles.required} iconName="Asterisk" /> }</span>
                (<>
                  <span key={`dataviewer-id-left`} className={`PropertyFieldCollectionData__panel__table-cell ${styles.tableCell}`}>Left <Icon className={styles.required} iconName="Asterisk" /> </span>
                  <span key={`dataviewer-id-comparer`} className={`PropertyFieldCollectionData__panel__table-cell ${styles.tableCell}`}>Comparer <Icon className={styles.required} iconName="Asterisk" /> </span>
                  <span key={`dataviewer-id-right`} className={`PropertyFieldCollectionData__panel__table-cell ${styles.tableCell}`}>Right <Icon className={styles.required} iconName="Asterisk" /> </span>
                </>)

              //))
            }
            <span className={`PropertyFieldCollectionData__panel__table-cell ${styles.tableCell}`}></span>
            <span className={`PropertyFieldCollectionData__panel__table-cell ${styles.tableCell}`}></span>
          </div>
          {
            (this.state.crntItems && this.state.crntItems.length > 0) && (
              this.state.crntItems.map((item, idx, allItems) => (
                <RuleTreeNode 
                index={idx}
                item={item}
                totalItems={allItems.length}
                sortingEnabled={this.props.enableSorting}
                disableItemDeletion={this.props.disableItemDeletion}
                fUpdateItem={this.updateItem}
                fDeleteItem={this.deleteItem}
                fValidation={this.validateItem}
                fOnSorting={this.updateSortOrder} 
                />
              ))
            )
          }

          {
            !this.props.disableItemCreation && (
              <RuleTreeNode 
              index={null}
              item={null}
              sortingEnabled={this.props.enableSorting}
              totalItems={null}
              fAddItem={this.addItem}
              fAddInCreation={this.addInCreation}
            />
            )
          }
        </div>

        {
          (!this.state.crntItems || this.state.crntItems.length === 0) && (
            <p className={`PropertyFieldCollectionData__panel__no-collection-data ${styles.noCollectionData}`}>{strings.CollectionDataEmptyValue}</p>
          )
        }

        <div className={`PropertyFieldCollectionData__panel__actions ${styles.panelActions}`}>
          { this.state.inCreationItem && this.state.inCreationItemValid && <PrimaryButton text={this.props.saveAndAddBtnLabel || strings.CollectionSaveAndAddButtonLabel} onClick={this.addAndSave} disabled={!this.allItemsValid()} className="PropertyFieldCollectionData__panel__action__add" /> }
          { !(this.state.inCreationItem && this.state.inCreationItemValid) && <PrimaryButton text={this.props.saveBtnLabel || strings.SaveButtonLabel} onClick={this.onSave} disabled={!this.allItemsValid()} className="PropertyFieldCollectionData__panel__action__save" /> }
          <DefaultButton text={this.props.cancelBtnLabel || strings.CancelButtonLabel} onClick={this.onCancel} className="PropertyFieldCollectionData__panel__action__cancel" />
        </div>
      </div>
    );
  }
}

/*
{
              this.props.enableSorting && (
                <span className={`PropertyFieldCollectionData__panel__table-cell ${styles.tableCell}`}></span>
              )
            }
     <CollectionDataItem fields={visibleFields}
                                  index={null}
                                  item={null}
                                  sortingEnabled={this.props.enableSorting}
                                  totalItems={null}
                                  fAddItem={this.addItem}
                                  fAddInCreation={this.addInCreation} />

<CollectionDataItem key={item.uniqueId}
                                    fields={visibleFields}
                                    index={idx}
                                    item={item}
                                    totalItems={allItems.length}
                                    sortingEnabled={this.props.enableSorting}
                                    disableItemDeletion={this.props.disableItemDeletion}
                                    fUpdateItem={this.updateItem}
                                    fDeleteItem={this.deleteItem}
                                    fValidation={this.validateItem}
                                    fOnSorting={this.updateSortOrder} />
                                    
                                    */