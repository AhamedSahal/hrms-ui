import React from 'react';
import { camelize } from '../../utility';
import { Table } from 'antd';
import {itemRender} from "../../paginationfunction"
    const PreviewTable = ({ selectedData,selectedProperties,checkedValidation }) => {
     

      // const columns = selectedProperties
      //     .map(prop => {
      //       return {
      //       title: camelize(prop),
      //       dataIndex: prop,
      //       key: prop,
            
      //     }});

      //     columns.push({
      //       title: 'Return On',
      //       dataIndex: 'returnOn',
      //       key: 'returnOn',
      //       render: (text, record) => {
      //         if (record.previousOwner !== null && record.status === "AVAILABLE") {
      //           return new Date(text).toLocaleDateString('en-GB');
      //         }else{
      //           return '-'; 
      //         }
             
      //       },
      //     });

      const columns = selectedProperties.map(prop => {
        if (prop === 'returnOn') {
          return {
            title: camelize(prop),
            dataIndex: prop,
            key: prop,
            render: (text, record) => {
              if (text && /^\d{4}-\d{2}-\d{2}/.test(text)) {
                const date = new Date(text);
                return date.toLocaleDateString('en-GB');
              } else {
                return '-';
              }
            }
          };
        } else {
          return {
            title: camelize(prop),
            dataIndex: prop,
            key: prop,
          };
        }
      });
      

        return (<>
             {selectedData && selectedData.length > 0  && checkedValidation && <div className="row table-responsive">
            
            <Table id='Table-style' className="table-striped "
                  pagination= { {total : selectedData.length,
                    showTotal : (total, range) => `Showing ${range[0]} to ${range[1]} of ${selectedData.length} entries`,
                    showSizeChanger : true,itemRender : itemRender } }
                  columns={columns}     
                  dataSource={selectedData}
                  // rowKey={record => record.id}
                />
          </div>}
          </>
        )
    } 
export default PreviewTable;