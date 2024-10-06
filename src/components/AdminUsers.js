const AdminUsers = ({ users }) => {
  return (
    <div className="overflow-auto">
      <h2>Użytkownicy</h2>
      <ul className="list-group users-list">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item border-2 border-success user-item text-white"
          >
            <span>{user.id}</span>
            {/* TODO: Blokowanie użytkowników i wyświetlanie maila zamiast ID + Dodawanie maila użytkownika do firestore przy rejestracji */}
            <span className="block-user">Blokuj</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
