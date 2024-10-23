import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { VUE } from '../model/VUE';
import { cbioportalLink, getContextReferences, getHighestTherapeuticLevel } from '../utils/VUEUtils';
import vueLogo from "./../images/vue_logo.png";
import gnLogo from '../images/gn-logo.png';
import oncokbLogo from '../images/oncokb-logo.png';
import { DataStore } from '../store/DataStore';
import { Accordion } from 'react-bootstrap';
import { useTable, useSortBy, Column } from 'react-table';

import "./VUETable.css";

interface IVUETableProps {
    store: DataStore;
}

const VUETable: React.FC<IVUETableProps> = (props) => {
    const [vueData, setVueData] = useState<VUE[]>([]);
    const [searchInput, setSearchInput] = useState('');  // State for search input

    useEffect(() => {
        const setData = async () => {
            setVueData(await props.store.data);
        };
        setData();
    }, [props.store.data]);

    // Filter data based on search input
    const filteredData = useMemo(() => {
        if (!searchInput) {
            return vueData;
        }  
        return vueData.filter(item => {
            return Object.values(item).some(value => {
                return String(value).toLowerCase().includes(searchInput.toLowerCase());
            });
        });
    }, [vueData, searchInput]);

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
            accessor: (row: VUE) => getContextReferences(row),
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
    } = useTable({ columns, data: filteredData }, useSortBy);

    return (
        <div>
            {/* Search box */}
            <div>
                <input
                    type="text"
                    placeholder="Search by Gene or Context..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{ padding: '5px', width: '23%', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </div>

            <table {...getTableProps()} className="vue-table table table-bordered table-hover">
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
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? <i className="fa fa-chevron-down" style={{marginLeft: 5}} /> : <i className="fa fa-chevron-up" style={{marginLeft: 5}} />) : <></>}
                                    </span>
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
                                        {cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default VUETable;