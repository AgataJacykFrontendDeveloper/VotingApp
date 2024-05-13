import "./UserPanel.css";

const UserPanel = () => {
  return (
    <div className="container">
      <div className="left-menu">
        <button class=" votes">Głosy oddane dzisiaj</button>
        <button class=" user-info">Informacje podstawowe</button>
        <button class="settings">Dodatkowe ustawienia</button>
      </div>
      <div className="right-menu"></div>
    </div>
  );
};

export default UserPanel;
