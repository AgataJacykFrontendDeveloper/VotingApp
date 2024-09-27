import { useState, useContext } from "react";
import { doc, setDoc, addDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AlertContext from "../context/AlertProvider";

const createSlug = (title) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9 ]/g, "") // Remove non alphanumeric characters
    .replace(/\s+/g, "-"); // Replace whitespaces with hyphen
};

const AdminCreatePoll = () => {
  const { addAlert } = useContext(AlertContext);
  const [songs, setSongs] = useState([]);

  const handleSongAdd = () => {
    setSongs([
      ...songs,
      { artist: "", genre: "", title: "", url: "", votes: 0 },
    ]);
  };

  const handleSongDelete = (i) => {
    const updatedSongs = songs.filter((_, index) => index !== i);
    setSongs(updatedSongs);
  };

  const handleSongChange = (e, i) => {
    const { name, value } = e.target;
    const updatedSongs = [...songs];
    updatedSongs[i][name] = value;
    setSongs(updatedSongs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = {
      title: formData.get("title"),
      type: formData.get("type"),
      start_at: formData.get("start_at"),
      end_at: formData.get("end_at"),
    };

    if (form.title.length < 3) {
      return addAlert("Nazwa głosowania musi zawierać co najmniej 3 znaki.");
    }

    if (form.start_at >= form.end_at) {
      return addAlert(
        "Data zakończenia nie może być wcześniej niż data rozpoczęcia"
      );
    }

    if (songs.length === 0) {
      return addAlert("Musisz dodać co najmniej jeden utwór.");
    }

    const slug = createSlug(form.title);

    try {
      // TODO: Change later to transaction with batched writes
      const docRef = doc(db, "polls", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return addAlert("Głosowanie o takiej nazwie już istnieje.");
      } else {
        await setDoc(docRef, form);

        const songsRef = collection(docRef, "songs");
        for (let song of songs) {
          await addDoc(songsRef, song);
        }
        e.target.reset();
        setSongs([]);
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

        <div>
          <h4 className="ml-n2 mt-2">Lista utworów</h4>
          {songs.map((song, i) => (
            <div key={i} className="d-flex flex-column gap-1 mb-3">
              <div className="d-flex flex-row gap-2">
                <h5 className="fw-semibold my-auto">Utwór {i + 1}</h5>
                <button
                  className="border-0 p-1 bg-danger rounded h-100"
                  onClick={() => handleSongDelete(i)}
                >
                  <svg
                    className="text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                </button>
              </div>
              <label htmlFor={`song-artist-${i}`} className="form-label">
                Artysta
              </label>
              <input
                type="text"
                name="artist"
                id={`song-artist-${i}`}
                className="form-control"
                value={song.artist}
                onChange={(e) => handleSongChange(e, i)}
                required
              />

              <label htmlFor={`song-genre-${i}`} className="form-label">
                Gatunek
              </label>
              <input
                type="text"
                name="genre"
                id={`song-genre-${i}`}
                className="form-control"
                value={song.genre}
                onChange={(e) => handleSongChange(e, i)}
                required
              />

              <label htmlFor={`song-title-${i}`} className="form-label">
                Tytuł
              </label>
              <input
                type="text"
                name="title"
                id={`song-title-${i}`}
                className="form-control"
                value={song.title}
                onChange={(e) => handleSongChange(e, i)}
                required
              />

              <label htmlFor={`song-url-${i}`} className="form-label">
                URL
              </label>
              <input
                type="url"
                name="url"
                id={`song-url-${i}`}
                className="form-control"
                value={song.url}
                onChange={(e) => handleSongChange(e, i)}
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleSongAdd}
            className="btn-cyan w-fit"
          >
            Dodaj utwór
          </button>
        </div>

        <button type="submit" className="btn-cyan w-fit">
          Utwórz głosowanie
        </button>
      </form>
    </div>
  );
};

export default AdminCreatePoll;
