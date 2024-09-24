import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const createSlug = (title) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9 ]/g, "") // Remove non alphanumeric characters
    .replace(/\s+/g, "-"); // Replace whitespaces with hyphen
};

const AdminCreatePoll = (addAlert) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = {};
    for (const [key, value] of formData.entries()) {
      form[key] = value;
    }

    if (form.title.length < 3) {
      return addAlert("Nazwa głosowania musi zawierać co najmniej 3 znaki.");
    }

    if (form.start_at >= form.end_at) {
      return addAlert(
        "Data zakończenia nie może być wcześniej niż data rozpoczęcia"
      );
    }

    const slug = createSlug(form.title);

    try {
      const docRef = doc(db, "polls", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return addAlert("Głosowanie o takiej nazwie już istnieje.");
      } else {
        await setDoc(docRef, form);
        e.target.reset();
        return addAlert("Głosowanie zostało utworzone.", "success");
      }
    } catch (error) {
      console.error("Error creating document: ", error);
      return addAlert(
        "Wystąpił błąd podczas tworzenia głosowania, spróbuj ponownie."
      );
    }
  };

  return (
    <div>
      <h2>Nowa lista utworów</h2>
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column gap-2 container-sm container m-0"
      >
        <label htmlFor="title" className="form-label">
          Nazwa
        </label>
        <input
          name="title"
          type="text"
          id="title"
          className="form-control"
          required
        />

        <label htmlFor="type" className="form-label">
          Typ głosowania
        </label>
        <select name="type" id="type" className="form-control">
          <option value="weekly">Tygodnia</option>
          <option value="monthly">Miesiąca</option>
        </select>

        <label htmlFor="start_at" className="form-label">
          Data rozpoczęcia
        </label>
        <input
          name="start_at"
          type="datetime-local"
          id="start_at"
          className="form-control"
          required
        />

        <label htmlFor="end_at" className="form-label">
          Data zakończenia
        </label>
        <input
          name="end_at"
          type="datetime-local"
          id="end_at"
          className="form-control"
          required
        />
        <button type="submit" className="btn-cyan w-fit">
          Utwórz głosowanie
        </button>
      </form>
    </div>
  );
};

export default AdminCreatePoll;
