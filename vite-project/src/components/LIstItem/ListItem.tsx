import { Link } from "react-router"

const ListItem = () => {
    return (
        <>
            <li>
                <Link to ={`/post/`}>
                    <span></span>
                    <span></span>
                </Link>
            </li>

        </>
    )
}

export default ListItem
