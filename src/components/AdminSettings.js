const AdminSettings = () => {
  return (
    <div>
      <h2>Zmiana hasła</h2>
      <form>
        <label htmlFor="oldPassword" className="form-label">
          Stare hasło
        </label>
        <input
          type="password"
          id="oldPassword"
          className="form-control"
          autoComplete="off"
          aria-describedby="passwordHelpBlock"
        />

        <label htmlFor="newPassword" className="form-label">
          Nowe hasło
        </label>
        <input
          type="password"
          id="newPassword"
          className="form-control"
          autoComplete="off"
          aria-describedby="passwordHelpBlock"
        />

        <label htmlFor="repeatNewPassword" className="form-label">
          Powtórz nowe hasło
        </label>
        <input
          type="password"
          id="repeatNewPassword"
          className="form-control"
          autoComplete="off"
          aria-describedby="passwordHelpBlock"
        />
      </form>
    </div>
  );
};

export default AdminSettings;
