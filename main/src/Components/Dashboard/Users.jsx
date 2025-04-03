import { useState } from "react";
import "./User.css"; // Import the CSS file

function Users() {
    const [users, setUsers] = useState([
        {
            userID: "1",
            userName: "Venkat",
            location: "222",
            number: "122",
            block: false,
        },
        {
            userID: "2",
            userName: "John Doe",
            location: "456",
            number: "789",
            block: false,
        },
        {
            userID: "3",
            userName: "Jane Smith",
            location: "789",
            number: "456",
            block: false,
        },
        {
            userID: "4",
            userName: "Alice Johnson",
            location: "123",
            number: "321",
            block: true,
        },
    ]);

    const toggleBlock = (userID) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.userID === userID
                    ? { ...user, block: !user.block }
                    : user
            )
        );
    };

    return (
        <div className="admin-dashboard">
            <div className="user-section">
                <h1 className="title">Manage Users</h1>
                <div className="user-list">
                    {users.map((user) => (
                        <div className="user-row" key={user.userID}>
                            <div className="user-info">
                                <h2>{user.userName}</h2>
                                <p>Location: {user.location}</p>
                                <p>Contact: {user.number}</p>
                                <p>
                                    Status:{" "}
                                    <span
                                        className={`status ${
                                            user.block ? "blocked" : "active"
                                        }`}
                                    >
                                        {user.block ? "Blocked" : "Active"}
                                    </span>
                                </p>
                            </div>
                            <button
                                className={`block-btn ${
                                    user.block ? "unblock" : "block"
                                }`}
                                onClick={() => toggleBlock(user.userID)}
                            >
                                {user.block ? "Unblock" : "Block"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="another-section">
                <h1>Additional Section</h1>
                <p>Add content here for the additional section.</p>
            </div>
        </div>
    );
}

export default Users;
