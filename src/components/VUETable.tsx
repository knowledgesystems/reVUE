import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { cbioportalLink, extractContextAndReferences, getHighestTherapeuticLevel, renderContextAndReferences } from '../utils/VUEUtils';
import vueLogo from "./../images/vue_logo.png";
import gnLogo from '../images/gn-logo.png';
import oncokbLogo from '../images/oncokb-logo.png';
import { DataStore } from '../store/DataStore';
import { Accordion, Table } from 'react-bootstrap';
import { useTable, useSortBy, Column, Row } from 'react-table';

import "./VUETable.css";

interface IVUETableProps {
    store: DataStore;
}

const therapeuticLevelSort = (rowA: Row<VUE>, rowB: Row<VUE>, columnId: string) => {
    const valueA = rowA.values[columnId];
    const valueB = rowB.values[columnId];

    const therapeuticLevelOrder = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'None'];

    const indexA = therapeuticLevelOrder.indexOf(valueA);
    const indexB = therapeuticLevelOrder.indexOf(valueB);

    if (indexA === -1 && indexB === -1) {
        return 0;
    } else if (indexA === -1) {
        return 1;
    } else if (indexB === -1) {
        return -1;
    } else {
        return indexB - indexA;
    }
};

const VUETable: React.FC<IVUETableProps> = (props) => {
    const [vueData, setVueData] = useState<VUE[]>([]);
    const [searchInput, setSearchInput] = useState('');  // State for search input

    useEffect(() => {
        const setData = async () => {
            setVueData(await props.store.data);
        };
        setData();
    }, [props.store.data]);

    // filter rows based on search input
    const filteredRows = useMemo(() => {
        return vueData.filter(row => {
            return (
                row.hugoGeneSymbol.toLowerCase().includes(searchInput.toLowerCase()) ||
                (getHighestTherapeuticLevel(row)?.toLowerCase() || '').includes(searchInput.toLowerCase()) ||
                row.defaultEffect.toLowerCase().includes(searchInput.toLowerCase()) ||
                (row.comment?.toLowerCase() || '').includes(searchInput.toLowerCase()) ||
                (extractContextAndReferences(row).context || '').includes(searchInput.toLowerCase()) ||
                extractContextAndReferences(row).references.some(reference => reference.referenceText.toLowerCase().includes(searchInput.toLowerCase()))
            );
        });
    }, [vueData, searchInput]);

    // Calculate summary values
    const curatedVUEsCount = filteredRows.reduce((total, row) => {
        return total + row.revisedProteinEffects.length;
    }, 0);
    const uniqueGenesCount = filteredRows.length;
    const uniqueArticlesCount = useMemo(() => {
        const pubmedIds = new Set<number>();

        filteredRows.forEach(row => {
            row.revisedProteinEffects.forEach(revisedProteinEffect => {
                revisedProteinEffect.references.forEach(reference => {
                    if (reference.pubmedId !== 0) {
                        pubmedIds.add(reference.pubmedId);
                    }
                });
            });
        });
        return pubmedIds.size;
    }, [filteredRows]);

    const columns: Column<VUE>[] = useMemo(() => [
        {
            Header: 'Gene',
            accessor: 'hugoGeneSymbol',
            Cell: ({ row }: any) => <Link to={`/vue/${row.original.hugoGeneSymbol}`}>{row.original.hugoGeneSymbol}</Link>,
            width: "7%"
        },
        {
            Header: 'VUE Count',
            accessor: (row: VUE) => row.revisedProteinEffects.length,
            Cell: ({ value }: any) => <span style={{ textAlign: 'right' }}>{value}</span>,
            width: "8%"
        },
        {
            Header: 'Therapeutic Level',
            accessor: (row: VUE) => getHighestTherapeuticLevel(row),
            sortType: therapeuticLevelSort,
            width: "10%"
        },
        {
            Header: 'Predicted Effect',
            accessor: 'defaultEffect',
            width: "12%"
        },
        {
            Header: <><img alt='reVUE logo' src={vueLogo} width={20} style={{marginBottom:2}} />{' '}Actual Effect</>,
            accessor: 'comment',
            Cell: ({ row }: any) => {
                const revisedProteinEffectList = row.original.revisedProteinEffects?.map((e: { revisedProteinEffect: string }) => e.revisedProteinEffect) || [];
                const uniqueRevisedProteinEffectList = revisedProteinEffectList.filter((value: string, index: number, array: string[]) => array.indexOf(value) === index);
                return (
                    <div style={{ width: 150 }}>
                        {uniqueRevisedProteinEffectList.length === 1 ? uniqueRevisedProteinEffectList[0] : ""}
                        {uniqueRevisedProteinEffectList.length > 1 && (
                            <Accordion as={"p"} flush>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header className='CollapseHeader'>{"Multiple"} <i className="fa fa-chevron-circle-down" /></Accordion.Header>
                                    <Accordion.Body>
                                        {uniqueRevisedProteinEffectList.join(", ")}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        )}
                    </div>
                );
            },
            width: "10%",
            disableSortBy: true
        },
        {
            Header: 'Context & References',
            id: 'context',
            accessor: (row: VUE) => renderContextAndReferences(extractContextAndReferences(row)),
            width: "43%",
            disableSortBy: true
        },
        {
            Header: 'Usage Example',
            accessor: (row: VUE) => (
                <>
                    {row.revisedProteinEffects && (
                        <>
                            <a href={`https://www.genomenexus.org/variant/${row.revisedProteinEffects[0].variant}`} rel="noreferrer" target="_blank">
                                <img src={gnLogo} alt="gn-logo" style={{ height: 20, marginRight: 10 }} />
                            </a>
                            <a href={`https://www.oncokb.org/hgvsg/${row.revisedProteinEffects[0].variant}`} rel="noreferrer" target="_blank">
                                <img src={oncokbLogo} alt="oncokb-logo" style={{ height: 16, marginRight: 10 }} />
                            </a>
                            {cbioportalLink(row.revisedProteinEffects[0].revisedProteinEffect.substring(2), row.hugoGeneSymbol)}
                        </>
                    )}
                </>
            ),
            width: "10%"
        }
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data: filteredRows }, useSortBy);

    return (
        <div className='vue-table'>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                {/* Summary */}
                <span>
                    <span className="search-summary-number">{curatedVUEsCount}</span>
                    <span className="search-summary-text">curated VUEs in</span>
                    <span className="search-summary-number">{uniqueGenesCount}</span>
                    <span className="search-summary-text">genes from</span>
                    <span className="search-summary-number">{uniqueArticlesCount}</span>
                    <span className="search-summary-text">articles</span>
                </span>
                {/* Search box */}
                <span className="table-search-box">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </span>
            </div>

            <Table {...getTableProps()} className="table-bordered table-hover">
            <thead>
            {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column: any) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} 
                                    style={{
                                        fontWeight: 'bold',
                                        background: '#f1f1f1',
                                        width: column.width
                                    }}
                                >
                                    <div style={{ cursor: 'pointer' }}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? <i className="fa fa-chevron-down" style={{marginLeft: 5}} /> : <i className="fa fa-chevron-up" style={{marginLeft: 5}} />) : <></>}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
            </tbody>
            </Table>
        </div>
    );
};

export default VUETable;