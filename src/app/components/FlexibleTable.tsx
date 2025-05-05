import React from 'react';

interface Column {
  key: string;
  title: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: any) => React.ReactNode;
}

interface FlexibleTableProps {
  columns: Column[];
  data: any[];
  rowKeyField?: string;
}

const FlexibleTable: React.FC<FlexibleTableProps> = ({ columns, data, rowKeyField = 'id' }) => {
  const renderCell = (item: any, column: Column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key];
  };

  const getCellClassName = (column: Column) => {
    let className = 'py-2 ';
    if (column.align === 'center') {
      className += 'text-center';
    } else if (column.align === 'right') {
      className += 'text-right';
    } else {
      className += 'text-left';
    }
    return className;
  };

  return (
    <table className="w-full text-black bg-white">
      <thead>
        <tr className="border-b">
          {columns.map((column) => (
            <th key={column.key} className={getCellClassName(column)}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item[rowKeyField]} className="border-b text-black">
            {columns.map((column) => (
              <td key={`${item[rowKeyField]}-${column.key}`} className={getCellClassName(column)}>
                {renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FlexibleTable;