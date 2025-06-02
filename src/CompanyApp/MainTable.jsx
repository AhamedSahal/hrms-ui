import React, { useState, useRef } from 'react';
import { data as testData } from './testData';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MainTable = ({ data = testData }) => {
    const initialColumns = [
        { name: 'Company Name', key: 'companyName' },
        { name: 'Industry', key: 'industry' },
        { name: 'Location', key: 'location' },
        { name: 'Country', key: 'country' },
        { name: 'Region', key: 'region' },
        { name: 'City', key: 'city' },
        { name: 'Ownership Type', key: 'ownershipType' },
        { name: 'Revenue Size', key: 'revenueSize' },
        { name: 'Revenue Range', key: 'revenueRange' },
        { name: 'Number of Employees', key: 'numberOfEmployees' },
        { name: 'Market Year (Survey Year) Pay Element', key: 'marketYear' },
        { name: 'Grade', key: 'grade' },
        { name: 'Job Function', key: 'jobFunction' },
        { name: 'Job Level', key: 'jobLevel' },
        { name: 'Job Sub-Function', key: 'jobSubFunction' },
        { name: 'Market Identifier', key: 'marketIdentifier' },
        { name: '10th Percentile - Monthly', key: 'p10' },
        { name: '25th Percentile - Monthly', key: 'p25' },
        { name: '50th Percentile - Monthly', key: 'p50' },
        { name: '75th Percentile - Monthly', key: 'p75' },
        { name: '90th Percentile - Monthly', key: 'p90' },
        { name: 'Average Monthly', key: 'avgMonthly' },
        { name: 'Target Market Monthly', key: 'targetMarketMonthly' }
    ];

    const [columns, setColumns] = useState(initialColumns);
    const [frozenIndexes, setFrozenIndexes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [draggedColIdx, setDraggedColIdx] = useState(null);
    const [swappingIdx, setSwappingIdx] = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dropdownIdx, setDropdownIdx] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const dropdownRef = useRef();
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const isAllSelected = paginatedData.length > 0 && paginatedData.every((row) => selectedRows.includes(row.companyName));

    const handleSelectRow = (rowKey) => {
        setSelectedRows((prev) =>
            prev.includes(rowKey)
                ? prev.filter((key) => key !== rowKey)
                : [...prev, rowKey]
        );
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedRows((prev) => prev.filter((key) => !paginatedData.some((row) => row.companyName === key)));
        } else {
            setSelectedRows((prev) => [
                ...prev,
                ...paginatedData
                    .map((row) => row.companyName)
                    .filter((key) => !prev.includes(key))
            ]);
        }
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;
        setColumns(reorder(columns, result.source.index, result.destination.index));
    };

    const handleHeaderClick = (idx) => {
        setDropdownIdx(idx === dropdownIdx ? null : idx);
    };

    const handleFreeze = (idx) => {
        setDropdownIdx(null);
        setColumns((prevColumns) => {
            if (frozenIndexes.includes(idx)) {
                // Unfreeze: remove from frozenIndexes
                setFrozenIndexes(frozenIndexes.filter(i => i !== idx));
                return prevColumns;
            } else {
                // Freeze: add to frozenIndexes and move column to left
                const newFrozenIndexes = [...frozenIndexes, idx];
                setFrozenIndexes(newFrozenIndexes);
                // Move the column to the left in the order of freezing
                const colToFreeze = prevColumns[idx];
                const newColumns = prevColumns.filter((_, i) => i !== idx);
                newColumns.splice(newFrozenIndexes.length - 1, 0, colToFreeze);
                return newColumns;
            }
        });
    };

    const handleSort = (key, direction) => {
        setSortConfig({ key, direction });
        setDropdownIdx(null);
    };

    // Sorting logic
    let sortedData = [...paginatedData];
    if (sortConfig.key) {
        sortedData.sort((a, b) => {
            if (a[sortConfig.key] === undefined || b[sortConfig.key] === undefined) return 0;
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return (
        <div style={{ overflowX: 'auto', width: '100%' }}>
            <DragDropContext onDragEnd={onDragEnd}>
                <table style={{fontSize: '13px', minWidth: '2000px', border: 'solid 1px #d3d1d1' }} className="table table-hover">
                    <thead>
                        <Droppable droppableId="droppable" direction="horizontal">
                            {(provided) => (
                                <tr ref={provided.innerRef} {...provided.droppableProps}>
                                    <th style={{ width: '40px',borderBottomColor: '#e0e0e0', background: '#e0e0e0', textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            aria-label="Select all rows"
                                        />
                                    </th>
                                    {columns.map((col, idx) => (
                                        <Draggable key={col.key} draggableId={col.key} index={idx}>
                                            {(provided, snapshot) => (
                                                <th
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={(e) => { e.stopPropagation(); handleHeaderClick(idx); }}
                                                    style={{
                                                        backgroundColor: idx < frozenIndexes.length ? '#d7d7d7' : '#e0e0e0',
                                                        fontWeight: '600',
                                                        borderBottomColor: '#e0e0e0',
                                                        ...provided.draggableProps.style,
                                                        zIndex: idx < frozenIndexes.length ? 2 : 'auto',
                                                        whiteSpace: 'nowrap',
                                                        width: '120px',
                                                        cursor: 'pointer',
                                                        background: '#e0e0e0',
                                                        transform: snapshot.isDragging
                                                            ? `${provided.draggableProps.style?.transform || ''} scale(0.97)`
                                                            : provided.draggableProps.style?.transform,
                                                        transition: 'transform 0.2s',
                                                        opacity: 1,
                                                        position: 'relative',
                                                        left: idx < frozenIndexes.length ? idx * 120 : 'auto',
                                                    }}
                                                >
                                                    {col.name}
                                                    {dropdownIdx === idx && (
                                                        <div
                                                            ref={dropdownRef}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '100%',
                                                                left: 0,
                                                                background: '#fff',
                                                                border: '1px solid #ccc',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                                zIndex: 100,
                                                                minWidth: '120px',
                                                                padding: '4px 0',
                                                            }}
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            <div style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleFreeze(idx)}>
                                                                {frozenIndexes.includes(idx) ? 'Unfreeze' : 'Freeze (Fix Left)'}
                                                            </div>
                                                            <div style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleSort(col.key, 'asc')}>
                                                                Sort Ascending
                                                            </div>
                                                            <div style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleSort(col.key, 'desc')}>
                                                                Sort Descending
                                                            </div>
                                                        </div>
                                                    )}
                                                </th>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </tr>
                            )}
                        </Droppable>
                    </thead>
                    <tbody>
                        {sortedData.map((row, i) => (
                            <tr key={i} className={selectedRows.includes(row.companyName) ? 'table-active' : ''}>
                                <td style={{ width: '40px', textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(row.companyName)}
                                        onChange={() => handleSelectRow(row.companyName)}
                                        aria-label={`Select row ${i + 1}`}
                                    />
                                </td>
                                {columns.map((col, idx) => (
                                    <td
                                        key={col.key}
                                        style={{
                                            position: idx < frozenIndexes.length ? 'sticky' : 'static',
                                            left: idx < frozenIndexes.length ? idx * 200 : 'auto',
                                            backgroundColor: idx < frozenIndexes.length ? '#d7d7d7' : '',
                                            
                                            whiteSpace: 'nowrap',
                                            width: '200px',
                                            transition: 'background 0.3s, box-shadow 0.3s'
                                        }}
                                    >
                                        {row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DragDropContext>
        </div>
    );
};

export default MainTable;
