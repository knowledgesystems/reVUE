import * as React from 'react';


class Usage extends React.Component<{}>
{
    public render()
    {
        return (
            <React.Fragment>
                <h1>How to Use</h1>
                <p className="text-justify">
                    The reVUE resource is under active development. Eventually
                    all VUE annotations will be fully integrated in <a
                    href="https://genomenexus.org" target="_blank"
                    rel="noreferrer">Genome Nexus</a> and <a
                    href="https://www.oncokb.org" target="_blank"
                    rel="noreferrer">OncoKB</a>, such that for anyone using
                    those tools there is no need to run reVUE separately. When
                    using a different annotator one will be able to use the
                    complete VUE dataset directly to get the revised protein
                    effects.
                </p>
            </React.Fragment>
        );
    }
}

export default Usage;
