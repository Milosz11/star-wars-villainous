interface Props {
    clientName: string;
    villain: string;
    isReady: Boolean;
}

function LobbyCard({ clientName, villain, isReady }: Props) {
    return (
        <>
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img
                            src="../../../Moff Gideon.png"
                            className="img-fluid rounded-start"
                            alt="..."
                        ></img>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{`${clientName} as ${
                                villain || "[choosing]"
                            }`}</h5>
                            <p className="card-text">Provide villain objective here.</p>
                            <p className="card-text">
                                {isReady ? (
                                    <span className="badge text-bg-success">Ready</span>
                                ) : (
                                    <span className="badge text-bg-danger">Not Ready</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LobbyCard;
