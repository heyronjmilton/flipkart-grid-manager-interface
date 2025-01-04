import { Link, useNavigate } from "react-router-dom"

const Nav=()=>{

    const handleClick = (path) => {
        navigate(path, { replace: true });
        window.location.reload(); // Reloads the current page without resetting the route
      };

    return(
        <nav className="bg-[#2563EB]" >
                <ul className="text-white flex flex-row justify-center font-bold space-x-4 md:space-x-12  p-2 md:p-4
                text-md
                md:text-xl
                ">
                    <li>
                    <Link to="/" onClick={() => handleClick("/")}>
                        Home
                    </Link>
                    </li>
                    <li>
                        <Link to="/insights" onClick={() => handleClick("/insights")}>
                        Insights
                        </Link>
                    </li>
                    <li>
                        <Link to="/expired-items" onClick={() => handleClick("/expired-items")}>
                        Expired Items
                        </Link>
                    </li>
                   
                </ul>
        </nav>
    )
}

export default Nav


