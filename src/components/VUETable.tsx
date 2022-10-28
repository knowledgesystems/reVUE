import React from 'react';
import { default as VUEData } from './../data/VUEs.json';

class VUETable extends React.Component<{}> {
    public render() {
        const DisplayData = VUEData.map((info) => {
            return (
                <tr>
                    <td>{info.hugoGeneSymbol}</td>
                    <td>{info.genomicLocation}</td>
                    <td>{info.defaultEffect}</td>
                    <td>{info.comment}</td>
                    <td>{info.context}{info.referenceText && (<>{' '}<a href={`https://pubmed.ncbi.nlm.nih.gov/${info.pubmedIds[0]}/`} rel="noreferrer" target="_blank">({info.referenceText})</a></>)}</td>
                    {/*<td><a href="https://www.genomenexus.org/variant/7:g.55249071C%3ET">Genome Nexus <i className="fa fa-external-link" /></a></td>*/}
                </tr>
            );
        });

        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Gene</th>
                            <th>Genomic Location</th>
                            <th>Default Effect</th>
                            <th>Actual Effect</th>
                            <th>Context & Reference</th>
                            {/*<th>Revised Example</th>*/}
                        </tr>
                    </thead>
                    <tbody>{DisplayData}</tbody>
                </table>
            </div>
        );
    }
}

export default VUETable;