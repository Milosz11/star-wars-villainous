interface Props {
    clientName: string;
    villain: string;
    isReady: Boolean;
}

function LobbyCard({ clientName, villain, isReady }: Props) {
    return (
        <>
            <div className="card mb-3" style={{ maxWidth: "540px" }}>
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
                            <h5 className="card-title">{`${clientName} as ${villain}`}</h5>
                            <p className="card-text">Provide villain objective here.</p>
                            {isReady && (
                                <p className="card-text">
                                    <small className="text-body-secondary">Ready</small>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LobbyCard;
