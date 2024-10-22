import { blockUser } from "../hooks/useAdminPanel";
import { useAuth } from "../context/AuthProvider";

const AdminUsers = ({ users, setUserList }) => {
  const auth = useAuth();
  const handleBlock = async (id, status) => {
    const success = await blockUser(id, status);
    if (success) {
      setUserList((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isBlocked: status } : user
        )
      );
    }
  };

  return (
    <div>
      <h2>Użytkownicy</h2>
      <div className="overflow-auto">
        <ul className="list-group users-list">
          {users.map((user) => (
            <li
              key={user.id}
              className="list-group-item border-2 border-success user-item text-white"
            >
              <div className="d-flex flex-column flex-md-row w-100">
                <span className="w-100" style={{ maxWidth: 300 }}>
                  {user.id}
                </span>
                <span>{user.isAdmin ? "Admin" : "Użytkownik"}</span>
              </div>
              {/* TODO: wyświetlanie maila zamiast ID + Dodawanie maila użytkownika do firestore przy rejestracji */}
              {user.id !== auth.user.uid &&
                !user.isAdmin &&
                (user.isBlocked ? (
                  <button
                    className="unblock-user"
                    onClick={() => handleBlock(user.id, false)}
                  >
                    Odblokuj
                  </button>
                ) : (
                  <button
                    className="block-user"
                    onClick={() => handleBlock(user.id, true)}
                  >
                    Blokuj
                  </button>
                ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminUsers;
