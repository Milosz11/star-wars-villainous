interface Props {
    title: string;
    imagePath: string;
}

function Header({ title, imagePath }: Props) {
    return (
        <>
            <nav className="navbar bg-body-secondary">
                <div className="container-fluid">
                    <a className="navbar-brand">
                        <img
                            src={imagePath}
                            alt="Logo"
                            width="30"
                            height="30"
                            className="d-inline-block align-text-top"
                        ></img>
                        <span className="m-2">{title}</span>
                    </a>
                </div>
            </nav>
        </>
    );
}

export default Header;
